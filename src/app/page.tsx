import { getHomepage } from "@/lib/aem/queries";
import { isAEMConfigured } from "@/lib/aem/client";
import Hero from "@/components/Hero";
import ContentSection from "@/components/ContentSection";

/**
 * Homepage — Server Component.
 *
 * Fetches a HomepageContent Content Fragment from AEM at request time.
 * Falls back to MOCK_HOMEPAGE when AEM credentials are not configured,
 * so the page always renders — even without a live AEM connection.
 *
 * To connect to real AEM:
 *   1. cp .env.local.example .env.local
 *   2. Fill in AEM_HOST, AEM_TOKEN, AEM_GRAPHQL_ENDPOINT, AEM_HOMEPAGE_CF_PATH
 *   3. Restart the dev server
 */
export default async function Home() {
  const content = await getHomepage();
  const usingMockData = !isAEMConfigured();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Dev notice — hidden in production */}
      {usingMockData && process.env.NODE_ENV !== "production" && (
        <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950 dark:border-amber-800">
          <p className="mx-auto max-w-5xl px-6 py-2 text-sm text-amber-800 dark:text-amber-300">
            <strong>Dev mode:</strong> Rendering mock data — AEM env vars not
            configured. See{" "}
            <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">
              .env.local.example
            </code>{" "}
            for setup instructions.
          </p>
        </div>
      )}

      {/* Hero section driven by AEM HomepageContent CF */}
      <Hero
        title={content.herotitle}
        subtitle={content.herosubtitle}
        image={content.heroimage}
      />

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6">
        <hr className="border-zinc-200 dark:border-zinc-800" />
      </div>

      {/* ContentSection CFs — one section per fragment */}
      {content.sections.length > 0 ? (
        content.sections.map((section, i) => (
          <ContentSection
            key={`${section.title}-${i}`}
            section={section}
            index={i}
          />
        ))
      ) : (
        <p className="mx-auto max-w-5xl px-6 py-16 text-zinc-500 dark:text-zinc-400">
          No content sections found. Add ContentSection fragments to the
          HomepageContent fragment in AEM.
        </p>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>AEM + Next.js POC</span>
          <span>
            Source:{" "}
            {usingMockData ? (
              "Mock data (AEM not configured)"
            ) : (
              <code className="font-mono text-xs">
                {process.env.AEM_HOMEPAGE_CF_PATH}
              </code>
            )}
          </span>
        </div>
      </footer>
    </div>
  );
}

