import Image from "next/image";
import type { ContentSection as ContentSectionType } from "@/lib/aem/types";

interface ContentSectionProps {
  section: ContentSectionType;
  /** Alternate the image position on even-indexed sections. */
  index: number;
}

/**
 * Renders a single ContentSection Content Fragment.
 *
 * Layout: image on the right for even indexes, left for odd — creating a
 * zig-zag visual rhythm down the page. Falls back to text-only when no image
 * is present.
 *
 * Rich text (section.body.html) is rendered via dangerouslySetInnerHTML.
 * Content originates from AEM, which sanitises HTML at authoring time.
 * No additional sanitisation is applied here as this is a trusted internal CMS.
 */
export default function ContentSection({ section, index }: ContentSectionProps) {
  const publishHost = process.env.NEXT_PUBLIC_AEM_HOST ?? "";
  const imageUrl =
    section.image?._path && publishHost
      ? `${publishHost}${section.image._path}`
      : null;

  const imageOnRight = index % 2 === 0;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div
        className={`flex flex-col gap-10 ${
          imageUrl ? "lg:flex-row lg:items-center" : ""
        } ${imageUrl && !imageOnRight ? "lg:flex-row-reverse" : ""}`}
      >
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            {section.title}
          </h2>
          {/* AEM-authored rich text */}
          <div
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.body.html }}
          />
        </div>

        {/* Optional image from AEM DAM */}
        {imageUrl && (
          <div className="flex-1 min-w-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={imageUrl}
                alt={section.image?.description ?? section.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
