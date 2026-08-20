export type LabMode = "vulnerable" | "secure";

export function getLabMode(): LabMode {
  const raw = process.env.LAB_MODE ?? "secure";
  if (raw === "vulnerable" || raw === "secure") {
    return raw;
  }
  throw new Error('LAB_MODE must be "vulnerable" or "secure".');
}

export function isVulnerableMode(): boolean {
  return getLabMode() === "vulnerable";
}

export function assertLabSafety(): void {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (isVulnerableMode() && nodeEnv === "production") {
    throw new Error(
      "Refusing to start: LAB_MODE=vulnerable is forbidden when NODE_ENV=production.",
    );
  }
}
