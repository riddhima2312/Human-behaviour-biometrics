import { Card } from "@/components/ui/card";
import { BiometricsSummary } from "@/types/keystroke";

type AuthAnalysisProps = {
  summary: BiometricsSummary;
};

const riskClasses: Record<BiometricsSummary["riskLevel"], string> = {
  Low: "bg-emerald-500/20 text-emerald-500",
  Moderate: "bg-amber-500/20 text-amber-500",
  High: "bg-rose-500/20 text-rose-500",
};

export function AuthAnalysis({ summary }: AuthAnalysisProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Authentication Analysis</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskClasses[summary.riskLevel]}`}>
          {summary.riskLevel} risk
        </span>
      </div>

      <ProgressBar label="Auth confidence" value={summary.authConfidence} color="bg-blue-500" />
      <ProgressBar label="Anomaly score" value={summary.anomalyScore} color="bg-rose-500" />
      <ProgressBar label="Rhythm stability" value={summary.rhythmScore} color="bg-emerald-500" />

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {summary.anomalyScore > 65
          ? "Anomaly detected: behavior pattern deviates from baseline profile."
          : "Behavior profile remains within expected typing baseline."}
      </p>
    </Card>
  );
}

type ProgressBarProps = {
  label: string;
  value: number;
  color: string;
};

function ProgressBar({ label, value, color }: ProgressBarProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{Math.round(value)}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
