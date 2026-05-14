"use client";

import { KeyboardEvent, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { AuthAnalysis } from "@/components/auth-analysis";
import { MetricsOverview } from "@/components/metrics-overview";
import { TypingPanel } from "@/components/typing-panel";
import { buildSummary } from "@/lib/biometrics";
import { KeystrokePoint } from "@/types/keystroke";

const MAX_SAMPLES = 100;
const CHARS_PER_WORD = 5;

const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((module) => module.ThemeToggle),
  { ssr: false },
);

// Recharts depends on browser layout APIs, so this chart is client-only.
const KeystrokeChart = dynamic(
  () => import("@/components/charts/keystroke-chart").then((module) => module.KeystrokeChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-zinc-900/70">
        Waiting for chart initialization...
      </div>
    ),
  },
);

export default function Home() {
  const [text, setText] = useState("");
  const [points, setPoints] = useState<KeystrokePoint[]>([]);
  const downRef = useRef<Record<string, number>>({});
  const lastUpTimeRef = useRef<number | null>(null);
  const typingStartRef = useRef<number | null>(null);

  const summary = useMemo(() => buildSummary(points), [points]);

  const handleTextChange = (value: string) => {
    setText(value);

    if (!value.trim()) {
      typingStartRef.current = null;
      lastUpTimeRef.current = null;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!event.repeat) {
      if (typingStartRef.current === null) {
        typingStartRef.current = performance.now();
      }
      downRef.current[event.key] = performance.now();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const now = performance.now();
    const downTime = downRef.current[event.key];

    if (!downTime) {
      return;
    }

    const dwellTime = now - downTime;
    const flightTime = lastUpTimeRef.current ? now - lastUpTimeRef.current : 0;
    const startTime = typingStartRef.current ?? now;
    const elapsedSeconds = Math.max((now - startTime) / 1000, 1);
    const speedWpm =
      (event.currentTarget.value.length / CHARS_PER_WORD / elapsedSeconds) * 60;

    const nextPoint: KeystrokePoint = {
      id: points.length + 1,
      key: event.key,
      dwellTime,
      flightTime,
      speedWpm,
      rhythm: Math.abs(flightTime - dwellTime),
      timestamp: Date.now(),
    };

    setPoints((previous) => [...previous, nextPoint].slice(-MAX_SAMPLES));
    lastUpTimeRef.current = now;
    delete downRef.current[event.key];
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Behavioral Biometrics Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Real-time keystroke dynamics for dwell time, flight time, speed, rhythm, and anomaly-based authentication intelligence.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <MetricsOverview summary={summary} />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TypingPanel
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </div>
        <div className="lg:col-span-2">
          <AuthAnalysis summary={summary} />
        </div>
      </div>

      <KeystrokeChart points={points} />
    </div>
  );
}
