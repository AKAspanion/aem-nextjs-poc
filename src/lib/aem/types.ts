/**
 * TypeScript types representing the AEM Content Fragment models used in this POC.
 *
 * These must match the field names defined in your AEMaaCS Content Fragment Models.
 * Go to: AEM > Tools > Assets > Content Fragment Models to confirm field names.
 */

/** A reference to a DAM asset (image) returned by AEM GraphQL. */
export interface AEMImageReference {
  /** Absolute path in AEM DAM, e.g. /content/dam/my-site/images/hero.jpg */
  _path: string;
  /** Alt text stored on the asset (optional). */
  description?: string;
  /** Pixel width of the original asset (optional). */
  width?: number;
  /** Pixel height of the original asset (optional). */
  height?: number;
}

/** Multiline rich-text field returned by AEM GraphQL. */
export interface AEMMultilineText {
  /** Raw HTML string produced by AEM (safe to render as innerHTML). */
  html: string;
  /** Plain-text representation without markup. */
  plaintext: string;
}

/**
 * Represents the **ContentSection** Content Fragment model.
 * Each homepage section has a title, a rich-text body, and an optional image.
 */
export interface ContentSection {
  title: string;
  body: AEMMultilineText;
  image?: AEMImageReference | null;
}

/**
 * Represents the **HomepageContent** Content Fragment model.
 * Contains hero fields and an array of inline ContentSection fragments.
 */
export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: AEMImageReference | null;
  sections: ContentSection[];
}

/**
 * The shape of the data returned by the AEM GraphQL query for the homepage.
 * The outer key matches the GraphQL query field name.
 */
export interface HomepageQueryResult {
  homepageContentByPath: {
    item: HomepageContent;
  };
}
