import type { Metadata } from "next";
import { ABOUT_COPY } from "@/constants";
import { ProfileCard } from "@/features/about/components/profile-card";

export const metadata: Metadata = {
  title: `${ABOUT_COPY.badge} · ${ABOUT_COPY.name}`,
};

export default function AboutPage() {
  return (
    <section className="py-10 sm:py-16">
      <ProfileCard />
    </section>
  );
}
