import { useI18n } from "@/lib/i18n";
import {
  Bot, BarChart3, Zap, BookOpen, MessageSquare,
  Cpu, Globe, FileText, Shield, ChevronRight,
  Lightbulb, TrendingUp, Users, FileSearch
} from "lucide-react";
import { Link } from "react-router-dom";

interface SectionProps {
  icon: typeof Bot;
  title: string;
  children: React.ReactNode;
  gradient?: string;
}

function Section({ icon: Icon, title, children, gradient = "from-primary to-blue-500" }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="pl-4 border-l-2 border-primary/20 space-y-3">{children}</div>
    </section>
  );
}

interface StepProps {
  num: number;
  title: string;
  desc: string;
}

function Step({ num, title, desc }: StepProps) {
  return (
    <div className="flex gap-3 items-start">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
        {num}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: typeof Bot;
  title: string;
  desc: string;
  gradient: string;
}

function FeatureCard({ icon: Icon, title, desc, gradient }: FeatureCardProps) {
  return (
    <div className="group relative rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-2 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

export function Guide() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <BookOpen className="h-4 w-4" />
          {t.guideBadge}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.guideTitle}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t.guideSubtitle}
        </p>
      </div>

      {/* What is Vibe-Trading */}
      <Section icon={Bot} title={t.guideWhatTitle} gradient="from-primary to-blue-500">
        <p className="text-muted-foreground leading-relaxed">{t.guideWhatDesc}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <FeatureCard icon={TrendingUp} title={t.guideF1Title} desc={t.guideF1Desc} gradient="from-pink-500 to-orange-400" />
          <FeatureCard icon={Cpu} title={t.guideF2Title} desc={t.guideF2Desc} gradient="from-cyan-400 to-indigo-500" />
          <FeatureCard icon={Users} title={t.guideF3Title} desc={t.guideF3Desc} gradient="from-violet-500 to-fuchsia-400" />
          <FeatureCard icon={FileSearch} title={t.guideF4Title} desc={t.guideF4Desc} gradient="from-emerald-400 to-teal-400" />
        </div>
      </Section>

      {/* Quick Start */}
      <Section icon={Zap} title={t.guideQuickTitle} gradient="from-amber-400 to-orange-500">
        <div className="space-y-4">
          <Step num={1} title={t.guideStep1Title} desc={t.guideStep1Desc} />
          <Step num={2} title={t.guideStep2Title} desc={t.guideStep2Desc} />
          <Step num={3} title={t.guideStep3Title} desc={t.guideStep3Desc} />
          <Step num={4} title={t.guideStep4Title} desc={t.guideStep4Desc} />
        </div>
        <Link
          to="/agent"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all"
        >
          {t.startResearch}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Section>

      {/* Core Features */}
      <Section icon={BarChart3} title={t.guideCoreTitle} gradient="from-cyan-400 to-indigo-500">
        <div className="space-y-5">
          {/* AI Agent */}
          <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> {t.guideAgentTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.guideAgentDesc}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t.guideAgentL1}</li>
              <li>{t.guideAgentL2}</li>
              <li>{t.guideAgentL3}</li>
            </ul>
          </div>
          {/* Swarm */}
          <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> {t.guideSwarmTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.guideSwarmDesc}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t.guideSwarmL1}</li>
              <li>{t.guideSwarmL2}</li>
              <li>{t.guideSwarmL3}</li>
            </ul>
          </div>
          {/* Backtest */}
          <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-emerald-500" /> {t.guideBacktestTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.guideBacktestDesc}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t.guideBacktestL1}</li>
              <li>{t.guideBacktestL2}</li>
              <li>{t.guideBacktestL3}</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Markets & Data */}
      <Section icon={Globe} title={t.guideMarketTitle} gradient="from-emerald-400 to-teal-400">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/50 bg-red-500/5 p-4 space-y-1">
            <h3 className="font-semibold text-red-500">🇨🇳 A {t.guideMarketA}</h3>
            <p className="text-xs text-muted-foreground">{t.guideMarketADesc}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-orange-500/5 p-4 space-y-1">
            <h3 className="font-semibold text-orange-500">🪙 {t.guideMarketCrypto}</h3>
            <p className="text-xs text-muted-foreground">{t.guideMarketCryptoDesc}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-blue-500/5 p-4 space-y-1">
            <h3 className="font-semibold text-blue-500">🌎 {t.guideMarketUS}</h3>
            <p className="text-xs text-muted-foreground">{t.guideMarketUSDesc}</p>
          </div>
        </div>
      </Section>

      {/* Example Prompts */}
      <Section icon={Lightbulb} title={t.guideExamplesTitle} gradient="from-amber-400 to-yellow-400">
        <div className="space-y-2">
          {t.guideExamplePrompts.map((prompt, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/40 text-sm">
              <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{prompt}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Tips */}
      <Section icon={Shield} title={t.guideTipsTitle} gradient="from-rose-400 to-pink-500">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">💡</span> {t.guideTip1}</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">💡</span> {t.guideTip2}</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">💡</span> {t.guideTip3}</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">💡</span> {t.guideTip4}</li>
        </ul>
      </Section>

      {/* CTA */}
      <div className="text-center py-8 rounded-2xl bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/10">
        <h2 className="text-xl font-bold mb-2">{t.guideCtaTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.guideCtaDesc}</p>
        <Link
          to="/agent"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
        >
          <MessageSquare className="h-4 w-4" />
          {t.startResearch}
        </Link>
      </div>
    </div>
  );
}
