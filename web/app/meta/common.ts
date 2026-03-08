import type { MetaFunction } from "@remix-run/node";

// Site-wide defaults
const defaults = {
  siteName: "WateRefil",
  description: "Your partner in sustainable hydration solutions.",
};

type CreateMetaParams = {
  title?: string;
  description?: string;
};

/**
 * Creates a Remix MetaFunction with sensible defaults.
 * This version correctly accepts the arguments passed by Remix.
 */
export const createMeta = ({
  title,
  description,
}: CreateMetaParams = {}): MetaFunction => {
  // The returned function now properly accepts the `args` object from Remix,
  // even if we don't use it in this specific helper. This aligns it with
  // the expected `MetaFunction` type and prevents runtime errors.
  return (args) => {
    const finalTitle = title
      ? `${title} • ${defaults.siteName}`
      : defaults.siteName;

    const finalDescription = description || defaults.description;

    return [
      { title: finalTitle },
      { name: "description", content: finalDescription },
    ];
  };
};
