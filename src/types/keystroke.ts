export type KeystrokePoint = {
  id: number;
  key: string;
  dwellTime: number;
  flightTime: number;
  rhythm: number;
  speedWpm: number;
  timestamp: number;
};

export type RiskLevel = "Low" | "Moderate" | "High";

export type BiometricsSummary = {
  averageDwell: number;
  averageFlight: number;
  averageSpeed: number;
  rhythmScore: number;
  authConfidence: number;
  anomalyScore: number;
  riskLevel: RiskLevel;
};
