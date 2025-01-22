
// export const db = createClient({
//   url: "file:local.db",
//   syncUrl: "https://cyberfortech-cipherprofessor.aws-us-east-1.turso.io",
//   authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzc1NTM2ODksImlhdCI6MTczNzU1MDA4OSwiaWQiOiIzMjBiMjBhOC02OTY0LTQwNzYtOTlmNi02ZGNjMTAyNDhmOGIiLCJyaWQiOiJmMGJhNmU2NC03NzlkLTQ4MjYtODExYy1kYjFkY2YxZjE3ZmYifQ.wueL29enBOmZlLHLtW_npX5xfukOnW6IK1kyrcdq7gptGE4wEueqbvaI_nERgwMXeUBdS2v5I20u1aYnY5m8Cg",
// });

// // src/lib/db.ts
// import { createClient } from '@libsql/client';

// const url = process.env.TURSO_DATABASE_URL;
// const authToken = process.env.TURSO_AUTH_TOKEN;

// if (!url || !authToken) {
//   throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
// }

// export const db = createClient({
//   url,
//   authToken,
// });

import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
}

const client = createClient({
  url,
  authToken,
});

export { client as db };