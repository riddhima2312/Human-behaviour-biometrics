"use client";

import { useMemo, useRef, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface KeyLog {
  key: string;
  pressTime: number;
  releaseTime: number;
  dwellTime: number;
  flightTime: number;
}

export default function Home() {
  const [logs, setLogs] = useState<KeyLog[]>([]);

  const keyPressTimes = useRef<Record<string, number>>({});
  const lastKeyTime = useRef<number>(0);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const currentTime = Date.now();

    keyPressTimes.current[e.key] = currentTime;
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const releaseTime = Date.now();

    const pressTime =
      keyPressTimes.current[e.key];

    const dwellTime =
      releaseTime - pressTime;

    const flightTime =
      lastKeyTime.current === 0
        ? 0
        : pressTime - lastKeyTime.current;

    lastKeyTime.current = pressTime;

    const newLog: KeyLog = {
      key: e.key,
      pressTime,
      releaseTime,
      dwellTime,
      flightTime,
    };

    setLogs((prev) => [...prev, newLog]);
  };

  const avgDwellTime = useMemo(() => {
    if (logs.length === 0) return 0;

    const total = logs.reduce(
      (sum, log) => sum + log.dwellTime,
      0
    );

    return Math.round(total / logs.length);
  }, [logs]);

  const avgFlightTime = useMemo(() => {
    if (logs.length === 0) return 0;

    const validFlights = logs.filter(
      (log) => log.flightTime > 0
    );

    if (validFlights.length === 0) return 0;

    const total = validFlights.reduce(
      (sum, log) => sum + log.flightTime,
      0
    );

    return Math.round(
      total / validFlights.length
    );
  }, [logs]);

  const chartData = logs.map((log, index) => ({
    index: index + 1,
    dwellTime: log.dwellTime,
    flightTime: log.flightTime,
  }));

  const downloadCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      "key",
      "dwellTime",
      "flightTime",
    ];

    const rows = logs.map((log) => [
      log.key,
      log.dwellTime,
      log.flightTime,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "behavioral_biometrics.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  const riskLevel = useMemo(() => {
    if (logs.length < 5) {
      return "ANALYZING";
    }

    if (
      avgDwellTime < 40 ||
      avgFlightTime < 30
    ) {
      return "HIGH RISK";
    }

    if (
      avgDwellTime < 70 ||
      avgFlightTime < 60
    ) {
      return "SUSPICIOUS";
    }

    return "SAFE";
  }, [logs, avgDwellTime, avgFlightTime]);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-2">
        Human Behavior Biometrics
      </h1>

      <p className="text-zinc-400 mb-10">
        Real-time Keystroke Analytics Dashboard
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          placeholder="Start typing..."
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className="w-full max-w-2xl px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-700 outline-none"
        />

        <button
          onClick={downloadCSV}
          className="mt-5 sm:mt-0 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold text-black transition"
        >
          Export Dataset CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-zinc-400 text-sm">
            Total Keystrokes
          </h2>

          <p className="text-4xl font-bold mt-2">
            {logs.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-zinc-400 text-sm">
            Avg Dwell Time
          </h2>

          <p className="text-4xl font-bold mt-2">
            {avgDwellTime} ms
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-zinc-400 text-sm">
            Avg Flight Time
          </h2>

          <p className="text-4xl font-bold mt-2">
            {avgFlightTime} ms
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-zinc-400 text-sm">
            Risk Level
          </h2>

          <p className="text-3xl font-bold mt-2">
            {riskLevel}
          </p>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="mt-10 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <h2 className="text-2xl font-semibold mb-5">
          Recent Keystrokes
        </h2>

        <div className="space-y-3 max-h-[400px] overflow-auto">
          {logs
            .slice()
            .reverse()
            .map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-zinc-800 p-4 rounded-xl"
              >
                <div>
                  <p className="font-semibold">
                    Key: {log.key}
                  </p>

                  <p className="text-sm text-zinc-400">
                    Dwell: {log.dwellTime}ms
                  </p>
                </div>

                <p className="text-sm text-zinc-400">
                  Flight: {log.flightTime}ms
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-10 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <h2 className="text-2xl font-semibold mb-6">
          Behavioral Analytics
        </h2>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="dwellTime"
                stroke="#22c55e"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="flightTime"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}