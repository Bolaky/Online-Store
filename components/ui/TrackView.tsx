"use client";
import { useEffect } from "react";

export default function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    // fire-and-forget — مش بنستنى response
    fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "trackView", product_id: productId }),
    }).catch(() => {});
  }, [productId]);

  return null;
}
