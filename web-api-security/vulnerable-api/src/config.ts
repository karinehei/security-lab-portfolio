import dotenv from "dotenv";

dotenv.config();

export type LabMode = "vulnerable" | "secure";

function readLabMode(): LabMode {
  const raw = process.env.LAB_MODE ?? "secure";
  if (raw === "vulnerable" || raw === "secure") {
    return raw;
  }
  throw new Error('LAB_MODE must be "vulnerable" or "secure".');
}

export function getLabMode(): LabMode {
  return readLabMode();
}

export function isVulnerableMode(): boolean {
  return getLabMode() === "vulnerable";
}

/**
 * Vulnerable lab behaviour is a local-training switch, not a product flag.
 * Refuse to boot that switch when the process claims to be production.
 */
export function assertLabSafety(): void {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const mode = getLabMode();

  if (mode === "vulnerable" && nodeEnv === "production") {
    throw new Error(
      "Refusing to start: LAB_MODE=vulnerable is forbidden when NODE_ENV=production.",
    );
  }
}

export const config = {
  get port(): number {
    return Number.parseInt(process.env.PORT ?? "3000", 10);
  },
  /**
   * Host bind. Default loopback for `npm run dev`.
   * Docker Compose sets 0.0.0.0 inside the container; published ports stay on 127.0.0.1.
   */
  get listenHost(): string {
    return process.env.LISTEN_HOST ?? "127.0.0.1";
  },
  get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is required.");
    }
    return secret;
  },
  get databaseUrl(): string {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is required.");
    }
    return url;
  },
  get nodeEnv(): string {
    return process.env.NODE_ENV ?? "development";
  },
  /** Access-token lifetime in secure mode. Vulnerable mode issues tokens with no exp. */
  jwtExpiresInSeconds: 15 * 60,
};
