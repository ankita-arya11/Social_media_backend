import 'dotenv/config';
import * as z from 'zod';

const configSchema = z
  .object({
    PORT: z.preprocess(Number, z.number()).default(8080).readonly(),
    NODE_ENV: z
      .enum(['DEVELOPMENT', 'PRODUCTION', 'STAGING'])
      .default('DEVELOPMENT')
      .readonly(),
    ALLOWED_ORIGINS: z.string().default('*'),
    MAIL_HOST: z.string().optional(),
    MAIL_PORT: z.preprocess(Number, z.number()).optional(),
    MAIL_USERNAME: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().optional(),
    MAIL_DISPLAY_NAME: z.string().optional(),

    DB_HOST: z.string().optional(),
    DB_PORT: z.string().optional(),
    DB_NAME: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),

    EMAIL_CLIENT_SECRET: z.string().optional(),
    EMAIL_CLIENT_ID: z.string().optional(),
    EMAIL_REFRESH_TOKEN: z.string().optional(),
    USER_EMAIL: z.string().optional(),
  })
  .readonly();

export type TConfig = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
