import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Human Behavior Biometrics",
  description:
    "AI-powered behavioral biometrics dashboard with real-time keystroke dynamics and anomaly detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-gradient-to-b from-slate-50 to-white text-zinc-900 transition-colors dark:from-zinc-950 dark:to-black dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
