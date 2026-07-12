// Signed OAuth `state`: prevents CSRF and carries the user ref + provider through the round-trip.
// Format: base64url(json).base64url(hmac_sha256(body, OAUTH_STATE_SECRET))
import crypto from 'node:crypto';

function secret() {
  const s = process.env.OAUTH_STATE_SECRET || '';
  if (!s) throw new Error('OAUTH_STATE_SECRET is not set');
  return s;
}

export function signState(obj) {
  const body = Buffer.from(JSON.stringify(obj)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyState(state) {
  const [body, sig] = String(state || '').split('.');
  if (!body || !sig) return null;
  const expect = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
