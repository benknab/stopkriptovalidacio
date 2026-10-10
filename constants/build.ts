// Vite embeds the same timestamp in the prerenderer and client bundle so dated
// content can hydrate correctly even when the export is served days later.
export const BUILD_DATE = new Date(import.meta.env?.BUILD_DATE ?? Date.now());
