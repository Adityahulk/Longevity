-- Wearable integration — Phase 1 schema.
-- One row per (user, provider) connection. Run once against your Neon database.

create table if not exists wearable_connection (
  id                 uuid primary key default gen_random_uuid(),
  user_ref           text not null,                 -- the per-user identifier the founder assigns (from the connect link ?u=)
  provider           text not null,                 -- 'oura' | 'whoop'
  access_token_enc   text not null,                 -- AES-256-GCM encrypted (see api/lib/crypto.js)
  refresh_token_enc  text,                           -- encrypted; may be null if provider issues none
  expires_at         timestamptz,                    -- access-token expiry
  scope              text,
  status             text not null default 'active', -- 'active' | 'revoked' | 'error'
  provider_user_id   text,                           -- optional: provider's own user id, filled on first sync
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_ref, provider)
);

create index if not exists wearable_connection_status_idx on wearable_connection (status);
