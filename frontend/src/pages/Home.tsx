import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, Zap, UserCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Feature {
  icon: typeof Bot;
  title: string;
  desc: string;
  gradient: string;
}

export function Home() {
  const { t } = useI18n();

  const FEATURES: Feature[] = [
    { icon: Bot, title: t.feat1, desc: t.feat1d, gradient: "from-pink-500 via-red-400 to-orange-400" },
    { icon: BarChart3, title: t.feat2, desc: t.feat2d, gradient: "from-cyan-400 via-blue-400 to-indigo-500" },
    { icon: Zap, title: t.feat3, desc: t.feat3d, gradient: "from-violet-500 via-purple-400 to-fuchsia-400" },
    { icon: UserCircle2, title: t.feat4, desc: t.feat4d, gradient: "from-emerald-400 via-teal-400 to-cyan-400" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-2xl text-center space-y-6 mb-8">
        <h1 className="text-4xl font-bold tracking-tight animate-hero-in">{t.heroTitle}</h1>
        <p className="text-lg text-muted-foreground animate-sub-in">{t.heroDesc}</p>

        <div className="relative inline-block group/cta">
          {/* CTA glow */}
          <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-primary to-info opacity-60 group-hover/cta:opacity-80 blur-md transition-opacity duration-300" />
          <Link
            to="/agent"
            className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-primary/20"
          >
            {t.startResearch}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Feature Cards - 图1 风格发光卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full mt-4">
        {FEATURES.map(({ icon: Icon, title, desc, gradient }, index) => (
          <div
            key={title}
            className="group relative animate-card-rise"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Outer glow on hover */}
            <div
              className={`absolute -inset-[1.5px] rounded-2xl opacity-0 group-hover:opacity-70 blur-lg transition-all duration-500
                bg-gradient-to-r ${gradient}`}
              style={{
                backgroundSize: '200% 200%',
                backgroundPosition: '0% 50%',
              }}
            />

            {/* Animated border ring */}
            <div
              className={`absolute -inset-[1px] rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
                style={{
                  animation: 'border-flow 2s linear infinite',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>

            {/* Card body */}
            <div
              className={`
                relative h-full rounded-2xl p-6 space-y-4
                bg-card/80 backdrop-blur-sm border border-border/40
                transition-all duration-300 ease-out
                group-hover:-translate-y-1.5 group-hover:border-transparent
                group-hover:shadow-2xl
              `}
            >
              {/* Inner ambient glow */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500
                  bg-gradient-to-br ${gradient}`}
              />

              {/* Icon with glow */}
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300
                    bg-gradient-to-br ${gradient}`}
                  style={{ transform: 'scale(1.5)' }}
                />
                <Icon
                  className={`h-9 w-9 text-white/90 drop-shadow-lg relative z-10
                    bg-gradient-to-br ${gradient} p-2 rounded-xl
                    transition-transform duration-300 group-hover:scale-110`}
                />
              </div>

              {/* Text content */}
              <div className="space-y-1.5">
                <h3 className="font-semibold text-base text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes hero-in {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-hero-in {
          animation: hero-in 0.6s ease-out both;
        }

        @keyframes sub-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-sub-in {
          animation: sub-in 0.6s ease-out 0.15s both;
        }

        @keyframes card-rise {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-card-rise {
          animation: card-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes border-flow {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
      `}</style>
    </div>
  );
}
