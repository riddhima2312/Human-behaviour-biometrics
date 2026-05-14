"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { KeystrokePoint } from "@/types/keystroke";

type KeystrokeChartProps = {
  points: KeystrokePoint[];
};

export function KeystrokeChart({ points }: KeystrokeChartProps) {
  return (
    <Card className="h-[360px]">
      <h2 className="text-lg font-semibold">Real-time Keystroke Dynamics</h2>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Live signal for dwell and flight times with typing speed context.
      </p>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={points} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="id" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="dwellTime"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            name="Dwell (ms)"
          />
          <Line
            type="monotone"
            dataKey="flightTime"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={false}
            name="Flight (ms)"
          />
          <Line
            type="monotone"
            dataKey="speedWpm"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="Speed (WPM)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
