import type { JTDSchemaType } from 'ajv/dist/jtd';

export interface EnvSchema {
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
}

export const envSchema: JTDSchemaType<EnvSchema> = {
  properties: {
    DB_NAME: { type: 'string' },
    DB_HOST: { type: 'string' },
    DB_PORT: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
  },
  optionalProperties: {},
  additionalProperties: true,
};
