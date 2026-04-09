import Image from "next/image";
import type { AEMImageReference } from "@/lib/aem/types";

interface HeroProps {
  title: string;
  subtitle: string;
  image?: AEMImageReference | null;
}

/**
 * Hero section rendered from AEM HomepageContent fields.
 *
 * When a hero image is present, it is served from AEM using next/image.
 * The AEM publish host (NEXT_PUBLIC_AEM_HOST) must be in next.config.ts
 * remotePatterns for the image to load — this is handled automatically.
 */
export default function Hero({ title, subtitle, image }: HeroProps) {
  const publishHost = process.env.NEXT_PUBLIC_AEM_HOST ?? "";
  const imageUrl =
    image?._path && publishHost
      ? `${publishHost}${image._path}`
      : null;

  return (
    <section className="relative w-full bg-zinc-900 text-white">
      {/* Background image from AEM DAM */}
      {imageUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={image?.description ?? title}
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:py-32 text-center">
        {/* AEM source badge */}
        <span className="inline-block mb-6 rounded-full bg-zinc-700/60 px-3 py-1 text-xs font-medium tracking-widest uppercase text-zinc-300">
          Content from AEM as a Cloud Service
        </span>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-zinc-300">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
