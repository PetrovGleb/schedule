import type { JTDSchemaType } from 'ajv/dist/jtd';

export interface EnvSchema {
  DATABASE_URL: string;
}

export const envSchema: JTDSchemaType<EnvSchema> = {
  properties: {
    DATABASE_URL: { type: 'string' },
  },
  optionalProperties: {},
  additionalProperties: true,
};
