import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_DESCRIPTION, APP_NAME, SITE_URL } from "@/constants";
import { Background } from "@/components/layout/background";
import { FlashToast } from "@/features/toast/flash-toast";
import { ToastProvider } from "@/features/toast/toast-provider";
import { ThemeScript } from "@/features/settings/theme-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  // The preview image comes from app/opengraph-image.png and app/twitter-image.png.
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

/** Lets the layout use the full screen on notched phones (safe-area insets are respected in CSS). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: ThemeScript sets data-theme before hydration.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="relative min-h-full font-sans">
        <Background />
        <ToastProvider>
          {children}
          {/* useSearchParams must sit in <Suspense> (cacheComponents). */}
          <Suspense fallback={null}>
            <FlashToast />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
