import { getAEMClient, isAEMConfigured } from "./client";
import type { HomepageContent, HomepageQueryResult } from "./types";

// ─── GraphQL Query ────────────────────────────────────────────────────────────

/**
 * Fetches a HomepageContent Content Fragment by its DAM path.
 *
 * The query uses `homepageContentByPath` — the convention AEM generates for a
 * model named "HomepageContent". Adjust if your model name differs.
 *
 * Inline fragments on ContentSection are used because AEM represents fragment
 * references as unions; the `... on ContentSectionModel` spread selects fields
 * from the linked ContentSection CF model.
 */
const HOMEPAGE_QUERY = /* GraphQL */ `
  query GetAllHomepages {
    homepagecontentList {
      items {
        _path
        herotitle
        herosubtitle
        heroimage {
          ... on ImageRef {
            _path
            description
            width
            height
          }
        }
        sections {
          ... on ContentsectionModel {
            title
            body {
              html
              plaintext
            }
            image {
              ... on ImageRef {
                _path
                description
                width
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Mock fallback data ───────────────────────────────────────────────────────

/**
 * Returned when AEM is not configured or unreachable.
 * Lets the page render correctly in local dev without needing live AEM access.
 */
export const MOCK_HOMEPAGE: HomepageContent = {
  _path: "/content/dam/global/en/home-mock",
  herotitle: "Welcome — AEM + Next.js POC",
  herosubtitle:
    "This content is served from mock data. Configure your .env.local to load real content from AEM as a Cloud Service.",
  heroimage: null,
  sections: [
    {
      title: "Server Components + AEM Headless",
      body: {
        html: "<p>Next.js App Router Server Components fetch Content Fragments at request time via the AEM GraphQL API. No client-side JavaScript is required to retrieve content.</p>",
        plaintext:
          "Next.js App Router Server Components fetch Content Fragments at request time via the AEM GraphQL API. No client-side JavaScript is required to retrieve content.",
      },
      image: null,
    },
    {
      title: "How to connect to AEM",
      body: {
        html: "<ol><li>Copy <code>.env.local.example</code> to <code>.env.local</code></li><li>Fill in your AEM_HOST, AEM_TOKEN, AEM_GRAPHQL_ENDPOINT, and AEM_HOMEPAGE_CF_PATH</li><li>Create the HomepageContent and ContentSection CF models in AEMaaCS</li><li>Restart the dev server</li></ol>",
        plaintext:
          "1. Copy .env.local.example to .env.local. 2. Fill in your AEM_HOST, AEM_TOKEN, AEM_GRAPHQL_ENDPOINT, and AEM_HOMEPAGE_CF_PATH. 3. Create the CF models. 4. Restart the dev server.",
      },
      image: null,
    },
  ],
};

// ─── Data fetcher ─────────────────────────────────────────────────────────────

/**
 * Fetches the homepage Content Fragment from AEM.
 *
 * Returns:
 * - The typed `HomepageContent` object on success.
 * - `MOCK_HOMEPAGE` when AEM env vars are absent.
 * - `MOCK_HOMEPAGE` on any network / GraphQL error (with a console warning).
 *
 * This function is safe to call from a Next.js Server Component.
 * Next.js caches `fetch` responses automatically; AEM responses are revalidated
 * on every request in development and cached per-deployment in production.
 */
export async function getHomepage(): Promise<HomepageContent> {
  if (!isAEMConfigured()) {
    console.warn(
      "[AEM] Environment variables not configured — rendering mock data. " +
        "See .env.local.example for setup instructions."
    );
    return MOCK_HOMEPAGE;
  }

  try {
    const client = getAEMClient();
    const response = await client.runQuery({
      query: HOMEPAGE_QUERY,
    });

    // AEM returns GraphQL errors in response.errors even on HTTP 200.
    if (response.errors?.length) {
      const messages = response.errors
        .map((e: { message: string }) => e.message)
        .join("; ");
      console.error(`[AEM] GraphQL errors: ${messages}`);
      return MOCK_HOMEPAGE;
    }

    const data = response.data as HomepageQueryResult;
    const items = data?.homepagecontentList?.items;

    if (!items || items.length === 0) {
      console.error(
        `[AEM] No HomepageContent fragments found. ` +
          "Check that CF model 'HomepageContent' has content created."
      );
      return MOCK_HOMEPAGE;
    }

    // Return the first item from the list
    return items[0];
  } catch (err) {
    console.error("[AEM] Failed to fetch homepage content:", err);
    return MOCK_HOMEPAGE;
  }
}
