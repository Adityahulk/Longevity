// GET /api/callback/:provider?code=...&state=...
// Verifies state, exchanges the code for tokens, encrypts them, and stores the connection.
import { PROVIDERS, baseUrl } from '../lib/providers.js';
import { verifyState } from '../lib/state.js';
import { encrypt } from '../lib/crypto.js';
import { upsertConnection } from '../lib/db.js';

export default async function handler(req, res) {
  const provider = req.query.provider;
  const cfg = PROVIDERS[provider];
  if (!cfg) return res.status(404).json({ error: 'unknown provider' });

  const { code, state, error } = req.query;
  if (error) return done(res, provider, 'denied');

  const st = verifyState(state);
  if (!st || st.p !== provider) return res.status(400).json({ error: 'invalid state' });
  if (!code) return res.status(400).json({ error: 'missing code' });

  const redirectUri = `${baseUrl(req)}/api/callback/${provider}`;
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: String(code),
    redirect_uri: redirectUri,
    client_id: cfg.clientId(),
    client_secret: cfg.clientSecret(),
  });

  let tok;
  try {
    const r = await fetch(cfg.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!r.ok) throw new Error(`token exchange failed: ${r.status}`);
    tok = await r.json();
  } catch (e) {
    console.error(`[${provider}] token exchange error:`, e.message);
    return done(res, provider, 'error');
  }

  if (!tok.access_token) return done(res, provider, 'error');

  const expiresAt = tok.expires_in ? new Date(Date.now() + Number(tok.expires_in) * 1000) : null;

  try {
    await upsertConnection({
      userRef: st.u,
      provider,
      accessTokenEnc: encrypt(tok.access_token),
      refreshTokenEnc: tok.refresh_token ? encrypt(tok.refresh_token) : null,
      expiresAt,
      scope: tok.scope || cfg.scope,
    });
  } catch (e) {
    console.error(`[${provider}] store error:`, e.message);
    return done(res, provider, 'error');
  }

  return done(res, provider, 'connected');
}

function done(res, provider, status) {
  res.writeHead(302, { Location: `/connect-wearable?connected=${provider}&status=${status}` });
  res.end();
}
