import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";

/** Public pages: landing and login. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header size="wide" />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16">{children}</main>
    </>
  );
}
