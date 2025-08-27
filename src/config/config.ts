import * as dotenv from 'dotenv';
import { envSchema } from './env.schema';
import type { EnvSchema } from './env.schema';
import Ajv from 'ajv/dist/jtd';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
const ajv = new Ajv();

const { DATABASE_URL } = process.env;

const validate = ajv.compile<EnvSchema>(envSchema);

if (validate(process.env)) {
  console.log('Env are valid according to schema');
} else {
  console.log(ajv.errorsText(validate.errors));
}

export { DATABASE_URL };
