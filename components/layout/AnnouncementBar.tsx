"use client";
// components/layout/AnnouncementBar.tsx
// Accepts dynamic offers from Offers_Annoncement sheet
// Falls back to static message from settings if offers empty

import { useState, useEffect } from "react";
import type { ApiOffer } from "@/lib/api.server";

interface Props {
  offers?:  ApiOffer[];
  message?: string; // fallback from settings.announcement
}

export default function AnnouncementBar({ offers = [], message }: Props) {
  const [visible, setVisible] = useState(true);
  const [idx,     setIdx]     = useState(0);

  // Auto-rotate offers every 4 seconds
  useEffect(() => {
    if (offers.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offers.length]);

  if (!visible) return null;

  // If no dynamic offers — show static message or nothing
  if (offers.length === 0) {
    if (!message) return null;
    return (
      <div className="bg-[#1a1a1a] text-white text-sm py-2 px-4 flex items-center justify-between">
        <div className="flex-1 text-center font-medium tracking-wide">{message}</div>
        <button onClick={() => setVisible(false)}
          className="text-white/60 hover:text-white transition-colors text-lg leading-none mr-2">
          ×
        </button>
      </div>
    );
  }

  const current  = offers[idx];
  const bg       = current.bg_color   || "#1a1a1a";
  const fg       = current.text_color || "#ffffff";
  const text     = current.content    || "";

  return (
    <div
      className="text-sm py-2 px-4 flex items-center justify-between transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="flex-1 text-center font-medium tracking-wide">
        {current.link ? (
          <a href={current.link} className="hover:underline">{text}</a>
        ) : (
          <span>{text}</span>
        )}
      </div>
      <div className="flex items-center gap-3 mr-2">
        {offers.length > 1 && (
          <div className="flex gap-1">
            {offers.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ backgroundColor: i === idx ? fg : `${fg}66` }}
              />
            ))}
          </div>
        )}
        <button onClick={() => setVisible(false)}
          className="hover:opacity-70 transition-opacity text-lg leading-none"
          style={{ color: fg }}>
          ×
        </button>
      </div>
    </div>
  );
}
