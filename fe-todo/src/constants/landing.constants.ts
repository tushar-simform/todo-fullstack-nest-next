export const LANDING_COPY = {
  badge: "Simple. Fast. Yours.",
  title: "Plan your day,",
  titleAccent: "own your time.",
  subtitle:
    "A beautiful todo app with due dates, repeating routines and a clear view of what is due, what is next, and what you have already done.",
  ctaLoggedOut: "Log in",
  ctaLoggedIn: "Open my todos",
  featuresHeading: "Everything you need to stay on track",
} as const;

export type LandingFeatureIcon = "clock" | "repeat" | "list" | "shield";

export const LANDING_FEATURES: {
  icon: LandingFeatureIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "clock",
    title: "Due dates & times",
    description: "Set a date and time for any task and see exactly what slipped past.",
  },
  {
    icon: "repeat",
    title: "Repeat on your days",
    description: "Daily habits or just Mon, Wed, Fri: tick each day off on its own.",
  },
  {
    icon: "list",
    title: "Today, Due, Upcoming, Done",
    description: "Five focused views so you always know what to do next.",
  },
  {
    icon: "shield",
    title: "Private to you",
    description: "Every account has its own todos, protected behind a secure login.",
  },
];
