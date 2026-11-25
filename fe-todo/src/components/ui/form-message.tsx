import { cn } from "@/lib/cn";

type FormMessageProps = { tone?: "error" | "success"; id?: string; children: string };

/** Inline form feedback: an error (announced as an alert) or a success note. */
export function FormMessage({ tone = "error", id, children }: FormMessageProps) {
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "animate-pop rounded-xl border px-4 py-2.5 text-sm",
        tone === "error"
          ? "border-danger/30 bg-danger/10 text-danger"
          : "border-success/30 bg-success/10 text-success",
      )}
    >
      {children}
    </p>
  );
}
