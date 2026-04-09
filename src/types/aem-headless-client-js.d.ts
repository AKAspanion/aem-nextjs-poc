/**
 * Type declarations for @adobe/aem-headless-client-js (ships no .d.ts files).
 * Covers the subset of the API used in this POC.
 */

declare module "@adobe/aem-headless-client-js" {
  export interface AEMHeadlessConfig {
    /** AEM server URL, e.g. 'https://author-pXXXX-eXXXX.adobeaemcloud.com' */
    serviceURL?: string;
    /** GraphQL endpoint path, e.g. 'content/graphql/global/endpoint.json' */
    endpoint?: string;
    /**
     * Authentication:
     * - string  → Bearer token (prefix "Bearer " added automatically)
     * - [user, pass] → Basic auth
     */
    auth?: string | [string, string];
    /** Additional HTTP headers sent with every request. */
    headers?: Record<string, string>;
  }

  export interface AEMQueryBody {
    query: string;
    variables?: Record<string, unknown>;
  }

  export interface AEMGraphQLError {
    message: string;
    locations?: Array<{ line: number; column: number }>;
  }

  export interface AEMQueryResponse<T = unknown> {
    data: T;
    errors?: AEMGraphQLError[];
  }

  class AEMHeadless {
    constructor(config: string | AEMHeadlessConfig);

    /** Execute an ad-hoc GraphQL query via POST. */
    runQuery<T = unknown>(
      body: string | AEMQueryBody,
      options?: RequestInit
    ): Promise<AEMQueryResponse<T>>;

    /** Execute a persisted query by path via GET. */
    runPersistedQuery<T = unknown>(
      path: string,
      variables?: Record<string, unknown>,
      options?: RequestInit
    ): Promise<AEMQueryResponse<T>>;
  }

  export default AEMHeadless;
  export { AEMHeadless };
}
