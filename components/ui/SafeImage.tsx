"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { normalizeImageUrl } from "@/lib/images";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

export default function SafeImage(props: ImageProps) {
  const { src: inSrc, alt, ...rest } = props;
  const initial = typeof inSrc === "string" ? normalizeImageUrl(inSrc) : DEFAULT_PLACEHOLDER_IMAGE_URL;
  const [src, setSrc] = useState<string>(initial);

  // Disable server-side optimization for Google Drive (googleusercontent) images
  let unoptimized = false;
  try {
    const host = new URL(src).hostname.toLowerCase();
    if (host.endsWith(".googleusercontent.com") || host === "lh3.googleusercontent.com") {
      unoptimized = true;
    }
  } catch (e) {
    // ignore
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={typeof alt === "string" ? alt : ""}
      onError={() => setSrc(DEFAULT_PLACEHOLDER_IMAGE_URL)}
      unoptimized={unoptimized}
    />
  );
}
