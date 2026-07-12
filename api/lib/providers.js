// OAuth2 config per provider. Both use the standard auth-code flow, so one code path serves both.
// The per-provider data normalizer (provider JSON -> wearable.json) is separate and lands with the
// daily sync (milestones M2/M4).

export const PROVIDERS = {
  oura: {
    label: 'Oura',
    authUrl: 'https://cloud.ouraring.com/oauth/authorize',
    tokenUrl: 'https://api.ouraring.com/oauth/token',
    scope: 'personal daily heartrate workout',
    clientId: () => process.env.OURA_CLIENT_ID,
    clientSecret: () => process.env.OURA_CLIENT_SECRET,
  },
  whoop: {
    label: 'Whoop',
    authUrl: 'https://api.prod.whoop.com/oauth/oauth2/auth',
    tokenUrl: 'https://api.prod.whoop.com/oauth/oauth2/token',
    // `offline` is required to receive a refresh token.
    scope: 'read:recovery read:sleep read:cycles read:workout offline',
    clientId: () => process.env.WHOOP_CLIENT_ID,
    clientSecret: () => process.env.WHOOP_CLIENT_SECRET,
  },
};

// Reconstruct this deployment's public origin from the incoming request headers.
export function baseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}
