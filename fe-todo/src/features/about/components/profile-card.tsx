import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MailIcon } from "@/components/ui/icons";
import { ABOUT_COPY, ABOUT_STACK } from "@/constants";
import portrait from "@/assets/tushar-mahajan.webp";

/** Photo, name, email and the stack this app is built with. */
export function ProfileCard() {
  return (
    <Card className="animate-fade-up mx-auto flex w-full max-w-xl flex-col items-center gap-6 p-6 text-center sm:p-10">
      <div className="rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-card">
        <Image
          src={portrait}
          alt={ABOUT_COPY.photoAlt}
          placeholder="blur"
          preload
          sizes="(min-width: 640px) 192px, 160px"
          className="size-40 rounded-full border-4 border-surface object-cover object-[center_20%] sm:size-48"
        />
      </div>

      <div className="min-w-0">
        <span className="inline-block rounded-full border border-border bg-surface-muted px-3.5 py-1 text-xs font-medium text-muted">
          {ABOUT_COPY.badge}
        </span>
        <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-4xl">{ABOUT_COPY.name}</h1>
        <p className="mt-3 text-base text-muted">{ABOUT_COPY.intro}</p>
      </div>

      <a
        href={`mailto:${ABOUT_COPY.email}`}
        className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-border bg-surface-muted px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-primary/60 active:scale-95 focus-visible:outline-2 focus-visible:outline-primary"
        aria-label={`${ABOUT_COPY.emailLabel}: ${ABOUT_COPY.email}`}
      >
        <MailIcon className="shrink-0 text-primary" />
        <span className="min-w-0 break-all">{ABOUT_COPY.email}</span>
      </a>

      <div className="w-full border-t border-border pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{ABOUT_COPY.stackHeading}</h2>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {ABOUT_STACK.map((tech) => (
            <li key={tech} className="whitespace-nowrap rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
