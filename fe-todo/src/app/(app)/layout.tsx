import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { PageContainer } from "@/components/layout/page-container";

/** Protected area (todos, settings). Access is enforced by proxy.ts and the data layer. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <PageContainer>{children}</PageContainer>
    </>
  );
}
