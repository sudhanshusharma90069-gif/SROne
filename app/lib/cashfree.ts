type CashfreeConfig =
  | {
      clientId: string;
      clientSecret: string;
      apiVersion: string;
      baseUrl: string;
      env: 'production' | 'sandbox';
      error?: never;
    }
  | { error: string };

export function getCashfreeConfig(): CashfreeConfig {
  const clientId =
    process.env.CASHFREE_CLIENT_ID ||
    process.env.CASHFREE_APP_ID ||
    '';
  const clientSecret =
    process.env.CASHFREE_CLIENT_SECRET ||
    process.env.CASHFREE_SECRET_KEY ||
    '';

  if (!clientId || !clientSecret) {
    return {
      error:
        'Cashfree is not configured. Add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET (or CASHFREE_APP_ID and CASHFREE_SECRET_KEY) to environment variables.',
    };
  }

  const explicitEnv = process.env.CASHFREE_ENV;
  const isProduction =
    explicitEnv === 'production' ||
    clientId.toUpperCase().startsWith('PROD_');

  const baseUrl = isProduction
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
  const env = isProduction ? 'production' : 'sandbox';
  const apiVersion = process.env.CASHFREE_API_VERSION || '2025-01-01';

  return { clientId, clientSecret, apiVersion, baseUrl, env };
}

export function cashfreeAuthHeaders(config: { clientId: string; clientSecret: string; apiVersion: string }) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-client-id': config.clientId,
    'x-client-secret': config.clientSecret,
    'x-api-version': config.apiVersion,
  };
}
