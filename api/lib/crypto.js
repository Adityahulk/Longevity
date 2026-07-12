// AES-256-GCM encryption for OAuth tokens at rest.
// Key = TOKEN_ENC_KEY env var, 32 bytes as 64 hex chars.
import crypto from 'node:crypto';

function key() {
  const k = Buffer.from(process.env.TOKEN_ENC_KEY || '', 'hex');
  if (k.length !== 32) {
    throw new Error('TOKEN_ENC_KEY must be 32 bytes (64 hex chars)');
  }
  return k;
}

// Returns base64( iv[12] | tag[16] | ciphertext ).
export function encrypt(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const ct = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

export function decrypt(payload) {
  const raw = Buffer.from(String(payload), 'base64');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ct = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}
