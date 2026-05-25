"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/images";
import { Product } from "@/types";
import { DEFAULT_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

interface Props {
  product: Product;
  discount?: number;
  lastPieceLabel?: string;
}

export default function ProductGallery({ product, discount = 0, lastPieceLabel }: Props) {
  const baseGalleryImages = useMemo(
    () => Array.from(
      new Set(
        (product.gallery || [])
          .filter(Boolean)
          .map(normalizeImageUrl)
      )
    ),
    [product.gallery]
  );
  const [allGalleryImages, setAllGalleryImages] = useState<string[]>(baseGalleryImages);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setAllGalleryImages(baseGalleryImages);
    setGalleryIndex(0);
    setImgError(false);
  }, [product.gallery, baseGalleryImages]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ image: string | null }>;
      const image = custom.detail?.image ? normalizeImageUrl(custom.detail.image) : null;
      if (!image) return;

      // Check if variant image already exists in gallery
      const matchIndex = allGalleryImages.findIndex((src) => src === image);
      if (matchIndex >= 0) {
        // Variant image is already in gallery, just switch to it
        setGalleryIndex(matchIndex);
      } else {
        // Variant image not in gallery, add it to the beginning (after base gallery)
        setAllGalleryImages((prev) => [image, ...prev]);
        setGalleryIndex(0);
      }
      setImgError(false);
    };

    window.addEventListener("productVariantImageChange", handler as EventListener);
    return () => window.removeEventListener("productVariantImageChange", handler as EventListener);
  }, [allGalleryImages]);

  const activeImage = allGalleryImages[galleryIndex] || DEFAULT_PLACEHOLDER_IMAGE_URL;
  const displayImage = activeImage;

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-50">
        <Image
          src={imgError ? DEFAULT_PLACEHOLDER_IMAGE_URL : normalizeImageUrl(displayImage)}
          alt={product.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setImgError(true)}
        />
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
            -{discount}%
          </div>
        )}
        {product.lastPiece && lastPieceLabel && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
            {lastPieceLabel}
          </div>
        )}
      </div>

      {allGalleryImages.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
          {allGalleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => {
                setGalleryIndex(index);
                setImgError(false);
              }}
              className={`relative aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 transition-colors ${
                galleryIndex === index ? "border-black" : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`${product.name} image ${index + 1}`}
            >
              <Image
                src={normalizeImageUrl(image)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
