import { Bot, TrendingUp, Sparkles, Users, Globe, NotebookPen, UserCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { playHover, playClick, playSwarmLaunch } from "@/lib/sounds";

interface Example {
  titleKey: string;
  descKey: string;
  prompt: string;
}

interface Category {
  labelKey: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  examples: Example[];
}

const CATEGORIES: Category[] = [
  {
    labelKey: "catBacktest",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-red-400",
    gradient: "from-pink-500 via-red-400 to-orange-400",
    examples: [
      { titleKey: "exCrossMarketTitle", descKey: "exCrossMarketDesc", prompt: "Backtest a risk-parity portfolio of 000001.SZ, BTC-USDT, and AAPL for full-year 2024, compare against equal-weight baseline" },
      { titleKey: "exBtcMacdTitle", descKey: "exBtcMacdDesc", prompt: "Backtest BTC-USDT 5-minute MACD strategy, fast=12 slow=26 signal=9, last 30 days" },
      { titleKey: "exUsDiversifyTitle", descKey: "exUsDiversifyDesc", prompt: "Backtest AAPL, MSFT, GOOGL, AMZN, NVDA with max_diversification portfolio optimizer, full-year 2024" },
    ],
  },
  {
    labelKey: "catResearch",
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-amber-400",
    gradient: "from-amber-400 via-yellow-400 to-orange-300",
    examples: [
      { titleKey: "exMultiFactorTitle", descKey: "exMultiFactorDesc", prompt: "Build a multi-factor alpha model using momentum, reversal, volatility, and turnover on CSI 300 constituents with IC-weighted factor synthesis, backtest 2023-2024" },
      { titleKey: "exOptionsTitle", descKey: "exOptionsDesc", prompt: "Calculate option Greeks using Black-Scholes: spot=100, strike=105, risk-free rate=3%, vol=25%, expiry=90 days, analyze Delta/Gamma/Theta/Vega" },
    ],
  },
  {
    labelKey: "catSwarm",
    icon: <Users className="h-4 w-4" />,
    color: "text-violet-400",
    gradient: "from-violet-500 via-purple-400 to-fuchsia-400",
    examples: [
      { titleKey: "exInvestCommitteeTitle", descKey: "exInvestCommitteeDesc", prompt: "[Swarm Team Mode] Use the investment_committee preset to evaluate whether to go long or short on NVDA given current market conditions" },
      { titleKey: "exQuantDeskTitle", descKey: "exQuantDeskDesc", prompt: "[Swarm Team Mode] Use the quant_strategy_desk preset to find and backtest the best momentum strategy on CSI 300 constituents" },
    ],
  },
  {
    labelKey: "catDocWeb",
    icon: <Globe className="h-4 w-4" />,
    color: "text-blue-400",
    gradient: "from-cyan-400 via-blue-400 to-indigo-500",
    examples: [
      { titleKey: "exEarningsTitle", descKey: "exEarningsDesc", prompt: "Summarize the key financial metrics, risks, and outlook from the uploaded earnings report" },
      { titleKey: "exWebResearchTitle", descKey: "exWebResearchDesc", prompt: "Read the latest Fed meeting minutes and summarize the key takeaways for equity and crypto markets" },
    ],
  },
  {
    labelKey: "catJournal",
    icon: <NotebookPen className="h-4 w-4" />,
    color: "text-orange-400",
    gradient: "from-orange-400 via-amber-400 to-yellow-300",
    examples: [
      { titleKey: "exBrokerExportTitle", descKey: "exBrokerExportDesc", prompt: "Analyze the trade journal I just uploaded — full profile with holding stats, win rate, top symbols, and hourly distribution" },
      { titleKey: "exBehaviorBiasTitle", descKey: "exBehaviorBiasDesc", prompt: "Run the 4 behavior diagnostics on my trade journal (disposition, overtrading, chasing, anchoring) and tell me which bias hurts my PnL most" },
    ],
  },
  {
    labelKey: "catShadow",
    icon: <UserCircle2 className="h-4 w-4" />,
    color: "text-emerald-400",
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
    examples: [
      { titleKey: "exShadowTrainTitle", descKey: "exShadowTrainDesc", prompt: "Train my shadow account from the trading journal I just uploaded — show the extracted rules and confirm they look like my behavior" },
      { titleKey: "exShadowDeltaTitle", descKey: "exShadowDeltaDesc", prompt: "Run a shadow backtest for the last 90 days on the US market and break down where my PnL diverged from the shadow (rule violations, early exits, missed signals)" },
      { titleKey: "exShadowReportTitle", descKey: "exShadowReportDesc", prompt: "Render the shadow report and give me the URL — lead with the you-vs-shadow delta" },
    ],
  },
];

const CHIP_KEYS = [
  "chipSkills", "chipSwarmPresets", "chipTools", "chipMarkets", "chipTimeframes",
  "chipOptimizers", "chipRiskMetrics", "chipOptions", "chipPdfWeb", "chipFactorML",
  "chipJournal", "chipShadow", "chipMemory", "chipSearch",
];

interface Props {
  onExample: (s: string) => void;
}

export function WelcomeScreen({ onExample }: Props) {
  const { t } = useI18n();

  const handleExampleClick = (prompt: string) => {
    playClick();
    // Play a special sound for swarm examples
    if (prompt.includes("[Swarm Team Mode]")) playSwarmLaunch();
    onExample(prompt);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
      {/* Header with animated icon */}
      <div className="space-y-3">
        <div className="relative h-16 w-16 mx-auto animate-wobble-hover">
          {/* Glow pulse behind icon */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/80 to-info/80 animate-pulse-glow blur-lg opacity-50" />
          <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-primary/80 to-info/80 flex items-center justify-center shadow-lg animate-float">
            <Bot className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.welcomeTitle}</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
            {t.welcomeSubtitle}
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed mx-auto">
            {t.describeStrategy}
          </p>
        </div>
      </div>

      {/* Capability chips with staggered entrance */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {CHIP_KEYS.map((key, i) => (
          <span
            key={key}
            className="px-2.5 py-1 text-xs rounded-full border border-border/60 text-muted-foreground bg-muted/30 animate-chip-in hover:bg-muted/60 hover:border-border transition-all duration-200 cursor-default animate-jello-hover"
            style={{ animationDelay: `${i * 40}ms` }}
            onMouseEnter={playHover}
          >
            {(t as unknown as Record<string, string>)[key]}
          </span>
        ))}
      </div>

      {/* Example categories grid with glowing cards */}
      <div className="w-full max-w-2xl text-left space-y-4">
        <p className="text-xs text-muted-foreground px-1">{t.examples}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat, catIdx) => (
            <div
              key={cat.labelKey}
              className="group space-y-2 animate-card-in"
              style={{ animationDelay: `${catIdx * 80}ms` }}
            >
              {/* Category label */}
              <div className={`flex items-center gap-1.5 text-xs font-medium px-1 ${cat.color} transition-colors`}>
                <span className="transition-transform duration-300 group-hover:scale-110 inline-block animate-shake-hover">
                  {cat.icon}
                </span>
                <span>{(t as unknown as Record<string, string>)[cat.labelKey]}</span>
              </div>

              <div className="space-y-1.5">
                {cat.examples.map((ex, exIdx) => (
                  <div
                    key={ex.titleKey}
                    className="relative group/ex rounded-xl animate-rumble-hover"
                    style={{ animationDelay: `${(catIdx * 3 + exIdx) * 60}ms` }}
                    onMouseEnter={playHover}
                  >
                    {/* Glow border on hover */}
                    <div className={`
                      absolute -inset-[1px] rounded-xl opacity-0 group-hover/ex:opacity-60
                      bg-gradient-to-r ${cat.gradient} blur-[6px]
                      transition-all duration-500
                    `} />

                    {/* Animated gradient border overlay */}
                    <div className={`
                      absolute -inset-[1px] rounded-xl overflow-hidden opacity-0 group-hover/ex:opacity-100
                      transition-opacity duration-300
                    `}>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${cat.gradient}`}
                        style={{ animation: `shimmer-border 2s linear infinite`, backgroundSize: '200% 100%' }}
                      />
                    </div>

                    <button
                      onClick={() => handleExampleClick(ex.prompt)}
                      className={`
                        relative block w-full text-left px-3 py-2.5 rounded-xl
                        bg-card border border-border/40
                        transition-all duration-300 ease-out
                        group-hover/ex:-translate-y-0.5
                        group-hover/ex:border-transparent
                        group-hover/ex:bg-card/80
                      `}
                    >
                      {/* Inner subtle glow on hover */}
                      <div className={`
                        absolute inset-0 rounded-xl opacity-0 group-hover/ex:opacity-[0.04]
                        bg-gradient-to-br ${cat.gradient}
                        transition-opacity duration-300
                      `} />

                      <span className="relative text-sm font-medium text-foreground leading-snug">
                        {(t as unknown as Record<string, string>)[ex.titleKey]}
                      </span>
                      <span className="relative block text-xs text-muted-foreground mt-0.5 leading-snug">
                        {(t as unknown as Record<string, string>)[ex.descKey]}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        @keyframes chip-in {
          from { opacity: 0; transform: translateY(6px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-chip-in {
          animation: chip-in 0.4s ease-out both;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-in {
          animation: card-in 0.5s ease-out both;
        }

        @keyframes shimmer-border {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ─── Shake / wobble / rumble hover effects ─── */

        @keyframes wobble {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(-3deg); }
          30% { transform: rotate(2.5deg); }
          45% { transform: rotate(-2deg); }
          60% { transform: rotate(1.5deg); }
          75% { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wobble-hover:hover {
          animation: wobble 0.6s ease-in-out;
        }

        @keyframes jello {
          0% { transform: scale(1); }
          15% { transform: scale(1.08, 0.92); }
          30% { transform: scale(0.95, 1.05); }
          45% { transform: scale(1.03, 0.97); }
          60% { transform: scale(0.99, 1.01); }
          100% { transform: scale(1); }
        }
        .animate-jello-hover:hover {
          animation: jello 0.5s ease-in-out;
        }

        @keyframes rumble {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-0.5px, 0.5px); }
          20% { transform: translate(0.5px, -0.5px); }
          30% { transform: translate(-0.5px, -0.5px); }
          40% { transform: translate(0.5px, 0.5px); }
          50% { transform: translate(-0.5px, 0.5px); }
          60% { transform: translate(0.5px, -0.5px); }
          70% { transform: translate(-0.5px, -0.5px); }
          80% { transform: translate(0.5px, 0.5px); }
          90% { transform: translate(-0.5px, 0.5px); }
          100% { transform: translate(0, 0); }
        }
        .animate-rumble-hover:hover {
          animation: rumble 0.4s ease-in-out;
        }

        @keyframes shake-icon {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(5deg); }
        }
        .animate-shake-hover:hover {
          animation: shake-icon 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
