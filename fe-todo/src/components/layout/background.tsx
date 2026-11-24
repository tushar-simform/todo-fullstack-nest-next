/** Decorative animated aurora behind the app. Purely visual. */
export function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="animate-float absolute -left-24 -top-24 size-[28rem] rounded-full bg-primary/20 blur-3xl" />
      <div
        className="animate-float absolute -right-24 top-1/3 size-[26rem] rounded-full bg-accent/15 blur-3xl"
        style={{ animationDelay: "-4s" }}
      />
    </div>
  );
}
