import { BiometricsSummary, KeystrokePoint, RiskLevel } from "@/types/keystroke";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const average = (values: number[]) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const withWarmupTrim = (values: number[], warmupCount: number) => {
  if (values.length <= warmupCount) {
    return values;
  }

  return values.slice(warmupCount);
};

const standardDeviation = (values: number[]) => {
  if (values.length <= 1) {
    return 0;
  }

  const mean = average(values);
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    (values.length - 1);

  return Math.sqrt(variance);
};

const resolveRisk = (anomalyScore: number): RiskLevel => {
  if (anomalyScore > 70) {
    return "High";
  }

  if (anomalyScore > 35) {
    return "Moderate";
  }

  return "Low";
};

export const buildSummary = (
  points: KeystrokePoint[],
  minimumSamples = 8,
): BiometricsSummary => {
  if (!points.length) {
    return {
      averageDwell: 0,
      averageFlight: 0,
      averageSpeed: 0,
      rhythmScore: 0,
      authConfidence: 0,
      anomalyScore: 0,
      riskLevel: "Low",
    };
  }

  const dwellSeries = points.map((point) => point.dwellTime);
  const flightSeries = points.map((point) => point.flightTime);
  const speedSeries = withWarmupTrim(
    points.map((point) => point.speedWpm),
    2,
  );

  const averageDwell = average(dwellSeries);
  const averageFlight = average(flightSeries);
  const averageSpeed = average(speedSeries);

  const rhythmSpread = standardDeviation(flightSeries);
  const rhythmScore = clamp(100 - rhythmSpread, 0, 100);

  if (points.length < minimumSamples) {
    return {
      averageDwell,
      averageFlight,
      averageSpeed,
      rhythmScore,
      authConfidence: 50,
      anomalyScore: 25,
      riskLevel: "Low",
    };
  }

  const pivot = Math.floor(points.length * 0.5);
  const baseline = points.slice(0, pivot);
  const current = points.slice(pivot);

  const baselineDwell = average(baseline.map((point) => point.dwellTime));
  const baselineFlight = average(baseline.map((point) => point.flightTime));
  const baselineSpeed = average(
    withWarmupTrim(
      baseline.map((point) => point.speedWpm),
      2,
    ),
  );

  const currentDwell = average(current.map((point) => point.dwellTime));
  const currentFlight = average(current.map((point) => point.flightTime));
  const currentSpeed = average(
    withWarmupTrim(
      current.map((point) => point.speedWpm),
      1,
    ),
  );

  const dwellDelta = Math.abs(currentDwell - baselineDwell) / Math.max(baselineDwell, 1);
  const flightDelta =
    Math.abs(currentFlight - baselineFlight) / Math.max(baselineFlight, 1);
  const speedDelta = Math.abs(currentSpeed - baselineSpeed) / Math.max(baselineSpeed, 1);

  const anomalyScore = clamp((dwellDelta * 45 + flightDelta * 35 + speedDelta * 20) * 100, 0, 100);
  const authConfidence = clamp(Math.round(100 - anomalyScore * 0.85 + rhythmScore * 0.1), 0, 100);

  return {
    averageDwell,
    averageFlight,
    averageSpeed,
    rhythmScore,
    authConfidence,
    anomalyScore,
    riskLevel: resolveRisk(anomalyScore),
  };
};
