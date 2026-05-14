import { Card } from "@/components/ui/card";
import { BiometricsSummary } from "@/types/keystroke";

const formatMs = (value: number) => `${Math.round(value)} ms`;

type MetricsOverviewProps = {
  summary: BiometricsSummary;
};

export function MetricsOverview({ summary }: MetricsOverviewProps) {
  const metrics = [
    { label: "Dwell Time", value: formatMs(summary.averageDwell) },
    { label: "Flight Time", value: formatMs(summary.averageFlight) },
    { label: "Typing Speed", value: `${summary.averageSpeed.toFixed(1)} WPM` },
    { label: "Rhythm", value: `${Math.round(summary.rhythmScore)} / 100` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
        </Card>
      ))}
    </div>
  );
}
