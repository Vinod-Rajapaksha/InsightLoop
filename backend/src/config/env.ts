import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables before validation
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .default("5000")
    .transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
  COOKIE_NAME: z.string().default("workpulse_auth"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-3.5-flash-lite"),
  GEMINI_TEMPERATURE: z
    .string()
    .default("0.2")
    .transform((val) => parseFloat(val)),
  GEMINI_MAX_OUTPUT_TOKENS: z
    .string()
    .default("8192")
    .transform((val) => parseInt(val, 10)),
  AI_RATE_LIMIT_WINDOW_MS: z
    .string()
    .default("900000")
    .transform((val) => parseInt(val, 10)),
  AI_RATE_LIMIT_MAX: z
    .string()
    .default("20")
    .transform((val) => parseInt(val, 10)),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:\n", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
