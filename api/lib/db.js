// Neon serverless Postgres client + connection helpers.
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

// Insert or update a user's connection for a provider (tokens already encrypted).
export async function upsertConnection({
  userRef,
  provider,
  accessTokenEnc,
  refreshTokenEnc,
  expiresAt,
  scope,
}) {
  await sql`
    insert into wearable_connection
      (user_ref, provider, access_token_enc, refresh_token_enc, expires_at, scope, status, updated_at)
    values
      (${userRef}, ${provider}, ${accessTokenEnc}, ${refreshTokenEnc}, ${expiresAt}, ${scope}, 'active', now())
    on conflict (user_ref, provider) do update set
      access_token_enc  = excluded.access_token_enc,
      refresh_token_enc = excluded.refresh_token_enc,
      expires_at        = excluded.expires_at,
      scope             = excluded.scope,
      status            = 'active',
      updated_at        = now()
  `;
}
