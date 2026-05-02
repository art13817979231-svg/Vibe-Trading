/**
 * useSwarmRunner — manages Swarm run lifecycle:
 * 1. Create swarm run via API
 * 2. Connect to SSE events with auto-reconnect (exponential backoff)
 * 3. Poll for completion status
 * 4. Update dashboard state in real-time
 */

import { useRef, useCallback, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { SwarmDashboardProps, SwarmAgent } from "@/components/chat/SwarmDashboard";
import { useI18n } from "@/lib/i18n";
import { useAgentStore } from "@/stores/agent";

const act = () => useAgentStore.getState();

export function useSwarmRunner() {
  const { t } = useI18n();
  const [swarmDash, setSwarmDash] = useState<SwarmDashboardProps | null>(null);
  const swarmCancelRef = useRef(false);

  const cancelSwarm = useCallback(() => {
    swarmCancelRef.current = true;
  }, []);

  const runSwarm = useCallback(
    async (presetName: string, presetTitle: string, prompt: string, setSearchParams?: (params: Record<string, string>, opts?: { replace: boolean }) => void) => {
      let sid = act().sessionId;
      if (!sid) {
        try {
          const session = await api.createSession(`[Swarm] ${presetTitle}: ${prompt.slice(0, 30)}`);
          sid = session.session_id;
          act().setSessionId(sid);
          setSearchParams?.({ session: sid }, { replace: true });
        } catch { /* continue without session */ }
      }

      act().addMessage({ id: "", type: "user", content: `[${presetTitle}] ${prompt}`, timestamp: Date.now() });
      act().setStatus("streaming");
      act().addMessage({ id: "swarm-progress", type: "answer", content: "", timestamp: Date.now() });
      swarmCancelRef.current = false;

      // Initialize dashboard state
      const dash: SwarmDashboardProps = {
        preset: presetTitle,
        agents: {},
        agentOrder: [],
        currentLayer: 0,
        finished: false,
        finalStatus: "",
        startTime: Date.now(),
        completedSummaries: [],
        finalReport: "",
      };
      setSwarmDash({ ...dash });

      const ensureAgent = (agentId: string): SwarmAgent => {
        if (!dash.agents[agentId]) {
          dash.agents[agentId] = { id: agentId, status: "waiting", tool: "", iters: 0, startedAt: 0, elapsed: 0, lastText: "", summary: "" };
          dash.agentOrder.push(agentId);
        }
        return dash.agents[agentId];
      };

      const flush = () => { setSwarmDash({ ...dash }); };

      try {
        const result = await api.createSwarmRun(presetName, { goal: prompt });
        const runId = result.id;
        const sseUrl = `/swarm/runs/${runId}/events`;

        /* ---------- SSE with auto-reconnect (exponential backoff) ---------- */
        let sseFinished = false;
        let retryCount = 0;
        let evtSource: EventSource | null = null;
        const MAX_RETRY = 8;

        const bindEvents = (es: EventSource) => {
          es.addEventListener("layer_started", (e) => {
            try { const d = JSON.parse(e.data); dash.currentLayer = d.data?.layer ?? 0; flush(); } catch {}
          });

          es.addEventListener("task_started", (e) => {
            try {
              const d = JSON.parse(e.data);
              const agentId = d.agent_id || "";
              if (agentId) { const a = ensureAgent(agentId); a.status = "running"; a.startedAt = Date.now(); flush(); }
            } catch {}
          });

          es.addEventListener("worker_text", (e) => {
            try {
              const d = JSON.parse(e.data);
              const agentId = d.agent_id || "";
              const content = (d.data?.content || "").trim();
              if (agentId && content) {
                const a = ensureAgent(agentId);
                const lastLine = content.split("\n").pop()?.trim() || "";
                if (lastLine) a.lastText = lastLine.slice(0, 60);
                flush();
              }
            } catch {}
          });

          es.addEventListener("tool_call", (e) => {
            try {
              const d = JSON.parse(e.data);
              const agentId = d.agent_id || "";
              const tool = d.data?.tool || "";
              if (agentId && tool) { const a = ensureAgent(agentId); a.tool = tool; a.iters++; flush(); }
            } catch {}
          });

          es.addEventListener("tool_result", (e) => {
            try {
              const d = JSON.parse(e.data);
              const agentId = d.agent_id || "";
              if (agentId) {
                const a = ensureAgent(agentId);
                const ok = (d.data?.status || "ok") === "ok";
                a.tool = `${a.tool} ${ok ? "\u2713" : "\u2717"}`;
                a.elapsed = a.startedAt ? Date.now() - a.startedAt : 0;
                flush();
              }
            } catch {}
          });

          es.addEventListener("task_completed", (e) => {
            try {
              const d = JSON.parse(e.data);
              const agentId = d.agent_id || "";
              if (agentId) {
                const a = ensureAgent(agentId);
                a.status = "done";
                a.elapsed = a.startedAt ? Date.now() - a.startedAt : 0;
                a.iters = d.data?.iterations ?? a.iters;
                const summary = d.data?.summary || "";
                if (summary) { a.summary = summary; dash.completedSummaries.push({ agentId, summary }); }
                flush();
              }
            } catch {}
          });

          es.addEventListener("task_failed", (e) => {
            try {
              const d = JSON.parse(e.data);
              const agentId = d.agent_id || "";
              if (agentId) {
                const a = ensureAgent(agentId);
                a.status = "failed";
                a.elapsed = a.startedAt ? Date.now() - a.startedAt : 0;
                const error = (d.data?.error || "").slice(0, 80);
                dash.completedSummaries.push({ agentId, summary: `FAILED: ${error}` });
                flush();
              }
            } catch {}
          });

          es.addEventListener("task_retry", (e) => {
            try { const d = JSON.parse(e.data); const agentId = d.agent_id || ""; if (agentId) { ensureAgent(agentId).status = "retry"; flush(); } } catch {}
          });

          es.addEventListener("done", () => { sseFinished = true; evtSource?.close(); });
        };

        const createSSE = (): EventSource => {
          const es = new EventSource(sseUrl);
          evtSource = es;
          bindEvents(es);

          es.onerror = () => {
            if (sseFinished || swarmCancelRef.current) { es.close(); return; }
            es.close();
            retryCount++;
            if (retryCount > MAX_RETRY) { toast.error(t.swarmSSEMaxRetry); return; }
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 30000);
            toast.warning(`${t.swarmReconnecting} (${retryCount}/${MAX_RETRY})`);
            setTimeout(() => { if (!sseFinished && !swarmCancelRef.current) createSSE(); }, delay);
          };

          return es;
        };

        evtSource = createSSE();

        /* ---------- Poll for completion ---------- */
        const MAX_POLL_ITERATIONS = 720;
        const WARNING_THRESHOLD = 660;

        for (let i = 0; i < MAX_POLL_ITERATIONS; i++) {
          await new Promise(r => setTimeout(r, 2500));
          if (swarmCancelRef.current) { evtSource?.close(); break; }
          try {
            const run = await api.getSwarmRun(runId);
            const rs = String(run.status || "");
            if (["completed", "failed", "cancelled"].includes(rs)) {
              evtSource?.close();
              dash.finished = true;
              dash.finalStatus = rs;
              const report = String(run.final_report || "");
              if (!report) {
                const tasks = (run.tasks || []) as Array<{ agent_id: string; summary?: string }>;
                dash.finalReport = tasks
                  .filter(task => task.summary && !task.summary.startsWith(t.workerIterLimit))
                  .map(task => `### ${task.agent_id}\n${task.summary}`)
                  .join("\n\n") || t.swarmCompleted;
              } else {
                dash.finalReport = report;
              }
              flush();
              act().setStatus("idle");
              return;
            }

            if (i === WARNING_THRESHOLD && !swarmCancelRef.current) {
              toast.info(t.swarmPollingWarning.replace("{m}", String(Math.round((MAX_POLL_ITERATIONS - i) * 2.5 / 60 * 10) / 10)));
            }
          } catch {}
        }
        evtSource?.close();
        act().addMessage({ id: "", type: "error", content: t.swarmTimedOut, timestamp: Date.now() });
        act().setStatus("idle");
      } catch (err) {
        act().setStatus("error");
        act().addMessage({ id: "", type: "error", content: `${t.swarmFailed}: ${err instanceof Error ? err.message : t.unknown}`, timestamp: Date.now() });
      }
    },
    [t]
  );

  return { runSwarm, swarmDash, cancelSwarm };
}
