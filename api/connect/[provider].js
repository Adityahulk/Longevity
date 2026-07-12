// GET /api/connect/:provider?u=<user_ref>
// Builds the provider's OAuth authorize URL (with a signed state carrying the user ref) and redirects.
import { PROVIDERS, baseUrl } from '../lib/providers.js';
import { signState } from '../lib/state.js';
import crypto from 'node:crypto';

export default function handler(req, res) {
  const provider = req.query.provider;
  const cfg = PROVIDERS[provider];
  if (!cfg) return res.status(404).json({ error: 'unknown provider' });

  const userRef = String(req.query.u || '').trim();
  if (!userRef) return res.status(400).json({ error: 'missing user ref (?u=)' });

  const clientId = cfg.clientId();
  if (!clientId) return res.status(500).json({ error: `${provider} is not configured` });

  const state = signState({ u: userRef, p: provider, n: crypto.randomBytes(8).toString('hex') });
  const redirectUri = `${baseUrl(req)}/api/callback/${provider}`;

  const url = new URL(cfg.authUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', cfg.scope);
  url.searchParams.set('state', state);

  res.writeHead(302, { Location: url.toString() });
  res.end();
}
