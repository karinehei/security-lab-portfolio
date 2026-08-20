import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Copy .env.example to .env and start PostgreSQL with docker compose up -d db",
  );
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-lab-jwt-secret-not-for-production";
}
