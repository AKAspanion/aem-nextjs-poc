import AEMHeadless from "@adobe/aem-headless-client-js";

/**
 * Validates that a required environment variable is set and returns its value.
 * Throws at module load time so misconfiguration is caught early during startup.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.local.example to .env.local and fill in all values.`
    );
  }
  return value;
}

/**
 * Returns true when all AEM env vars are configured.
 * Used to decide whether to attempt real AEM fetches or fall back to mock data.
 */
export function isAEMConfigured(): boolean {
  return Boolean(
    process.env.AEM_HOST &&
      process.env.AEM_GRAPHQL_ENDPOINT &&
      process.env.AEM_TOKEN
  );
}

/**
 * Lazily-initialised AEM Headless client singleton.
 * We defer validation/construction until first use so that the Next.js build
 * does not fail when env vars are absent (e.g. in CI without AEM access).
 */
let _client: AEMHeadless | null = null;

export function getAEMClient(): AEMHeadless {
  if (_client) return _client;

  _client = new AEMHeadless({
    serviceURL: requireEnv("AEM_HOST"),
    endpoint: requireEnv("AEM_GRAPHQL_ENDPOINT"),
    // Bearer token — the client prepends "Bearer " automatically.
    auth: requireEnv("AEM_TOKEN"),
  });

  return _client;
}
