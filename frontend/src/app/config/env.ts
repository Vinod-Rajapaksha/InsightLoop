import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().default("http://localhost:5000/api"),
  VITE_APP_ENV: z
    .enum(["development", "staging", "production", "test"])
    .default("development"),
  MODE: z.string().default("development"),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_ENV:
      import.meta.env.VITE_APP_ENV ||
      (import.meta.env.DEV ? "development" : "production"),
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  });

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables configuration.");
  }

  return parsed.data;
};

export const env = parseEnv();
