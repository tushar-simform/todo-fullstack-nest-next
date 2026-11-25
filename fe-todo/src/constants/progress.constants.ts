export const PROGRESS_RANGES = [
  { value: "week", label: "This week" },
  { value: "fortnight", label: "2 weeks" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
] as const;

export type ProgressRange = (typeof PROGRESS_RANGES)[number]["value"];

export const DEFAULT_PROGRESS_RANGE: ProgressRange = "week";

export const PROGRESS_NAV_LABEL = "Progress";
export const PROGRESS_TITLE = "My Progress";
export const PROGRESS_SUBTITLE = "What you planned, what you finished, and how far you've come.";

/** Motivation points: each finished todo, plus a bonus for a day where everything planned got done. */
export const POINTS_PER_TODO = 10;
export const POINTS_PER_PERFECT_DAY = 25;

/** How far back the streak looks. */
export const STREAK_LOOKBACK_DAYS = 90;

/** Day-by-day charts label every Nth bar once there are many (a month). */
export const CHART_LABEL_STEP_DAYS = 5;
export const CHART_LABEL_STEP_THRESHOLD = 14;

/** Highest `minRate` (percent of planned todos finished) the user has reached wins. */
export const MOTIVATION_TIERS = [
  { minRate: 100, emoji: "🏆", title: "Perfect run!", message: "Everything you planned is done. Treat yourself, you earned it." },
  { minRate: 75, emoji: "🔥", title: "You're on fire!", message: "Most of your plan is done. Finish strong." },
  { minRate: 50, emoji: "💪", title: "Solid progress", message: "You're past halfway. Keep the momentum going." },
  { minRate: 25, emoji: "🌱", title: "Good start", message: "Every finished todo counts. Pick the next small one." },
  { minRate: 1, emoji: "🚀", title: "Getting going", message: "The first steps are the hardest. You've begun." },
  { minRate: 0, emoji: "✨", title: "A fresh page", message: "Nothing finished yet. Tick off one small todo to begin." },
] as const;

export const MOTIVATION_EMPTY = {
  emoji: "📝",
  title: "Nothing planned yet",
  message: "Give your todos a date for this period and your progress will show up here.",
} as const;

export const STREAK_COPY = {
  none: "Finish everything planned today to start a streak.",
  some: (days: number) => `${days} ${days === 1 ? "day" : "days"} in a row with every planned todo done.`,
} as const;
