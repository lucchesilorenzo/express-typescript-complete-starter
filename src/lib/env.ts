import { z } from "zod";

const envSchema = z.object({
  APP_ORIGIN: z.url(),
  API_URL: z.url(),
  PORT: z.coerce.number().min(3000).max(5000),
  NODE_ENV: z
    .union([z.literal("development"), z.literal("production")])
    .default("development"),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
