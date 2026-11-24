import { Suspense } from "react";
import { ClockIcon, ListChecksIcon, RepeatIcon, ShieldIcon } from "@/components/ui/icons";
import { LANDING_COPY, LANDING_FEATURES, type LandingFeatureIcon } from "@/constants";
import { AppPreview } from "@/features/landing/components/app-preview";
import { FeatureCard } from "@/features/landing/components/feature-card";
import { LandingCta, LandingCtaFallback } from "@/features/landing/components/landing-cta";

const icons: Record<LandingFeatureIcon, React.ReactNode> = {
  clock: <ClockIcon />,
  repeat: <RepeatIcon />,
  list: <ListChecksIcon />,
  shield: <ShieldIcon />,
};

/** Public landing page. Everything else in the app requires login. */
export default function LandingPage() {
  return (
    <>
      <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <div className="text-center lg:text-left">
          <span className="animate-fade-up inline-block rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-medium text-muted">
            {LANDING_COPY.badge}
          </span>
          <h1
            className="animate-fade-up mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {LANDING_COPY.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {LANDING_COPY.titleAccent}
            </span>
          </h1>
          <p
            className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg lg:mx-0"
            style={{ animationDelay: "160ms" }}
          >
            {LANDING_COPY.subtitle}
          </p>
          <div
            className="animate-fade-up mt-8 flex justify-center lg:justify-start"
            style={{ animationDelay: "240ms" }}
          >
            <Suspense fallback={<LandingCtaFallback />}>
              <LandingCta />
            </Suspense>
          </div>
        </div>
        <AppPreview />
      </section>

      <section className="py-8 sm:py-12">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          {LANDING_COPY.featuresHeading}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={icons[feature.icon]}
              title={feature.title}
              description={feature.description}
              delayMs={i * 80}
            />
          ))}
        </div>
      </section>
    </>
  );
}
