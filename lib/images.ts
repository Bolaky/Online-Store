// ============================================================
// lib/images.ts — Centralized image URL normalization.
// ALL image URL manipulation happens here only.
// Components must NEVER manipulate image URLs directly.
//
// Supported input formats:
//   /file/d/ID/view
//   /d/ID
//   open?id=ID
//   uc?id=ID  or  uc?export=view&id=ID
//   thumbnail?id=ID  or  thumbnail?sz=...&id=ID
//   lh3.googleusercontent.com/d/ID  (already correct)
//
// Output: https://lh3.googleusercontent.com/d/FILE_ID
//   → Direct CDN image, no HTML redirect, no auth wall.
//
// Future CDN support: add a new branch before the Drive check.
// ============================================================

import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

/** Extract Google Drive file ID from any known URL format. */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;

  // Already lh3 format — extract ID from path
  if (url.includes("lh3.googleusercontent.com/d/")) {
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return m?.[1] ?? null;
  }

  if (!url.includes("drive.google.com") && !url.includes("docs.google.com")) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/ID/view
    /\/d\/([a-zA-Z0-9_-]+)/,                  // /d/ID
    /[?&]id=([a-zA-Z0-9_-]+)/,               // ?id=ID  &id=ID
    /open\?id=([a-zA-Z0-9_-]+)/,             // open?id=ID
    /thumbnail[^?]*[?&]id=([a-zA-Z0-9_-]+)/, // thumbnail?id=  thumbnail?sz=...&id=
    /uc[^?]*[?&]id=([a-zA-Z0-9_-]+)/,        // uc?id=  uc?export=view&id=
  ];

  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

/**
 * Normalize any image URL to a safe, renderable URL.
 *
 * Google Drive → lh3.googleusercontent.com/d/ID (direct CDN, stable)
 * Other HTTP   → returned as-is
 * Empty/null   → DEFAULT_PLACEHOLDER_IMAGE_URL
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  const raw = (url ?? "").trim();
  if (!raw) return DEFAULT_PLACEHOLDER_IMAGE_URL;

  // Already correct lh3 format — return as-is
  if (raw.startsWith("https://lh3.googleusercontent.com/d/")) return raw;

  // Google Drive — convert to lh3 CDN
  const driveId = extractGoogleDriveId(raw);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  // Valid non-Drive URL — return as-is (Unsplash, placehold.co, CDN, etc.)
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // Relative or unrecognized — return placeholder
  return DEFAULT_PLACEHOLDER_IMAGE_URL;
}
