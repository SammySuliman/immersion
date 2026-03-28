import "@/styles/globals.css";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LinguaSwitch",
  description: "Voice-first bilingual coaching with gradual code switching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">
          <header className="topbar">
            <Link className="brand" href="/">
              LinguaSwitch
            </Link>
            <nav className="nav">
              <Link href="/onboarding">Onboarding</Link>
              <Link href="/session">Session</Link>
              <Link href="/progress">Progress</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

