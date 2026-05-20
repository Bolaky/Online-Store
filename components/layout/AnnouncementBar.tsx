"use client";
import { useState } from "react";

const messages = [
  "🚚 توصيل مجاني للطلبات فوق 500 جنيه",
  "✨ تخفيضات حتى 40% على المجموعة الجديدة",
  "🎁 هدية مجانية مع كل طلب هذا الأسبوع",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);

  if (!visible) return null;

  return (
    <div className="bg-[#1a1a1a] text-white text-sm py-2 px-4 flex items-center justify-between">
      <div className="flex-1 text-center font-medium tracking-wide animate-pulse-slow">
        {messages[idx]}
      </div>
      <div className="flex items-center gap-3 mr-2">
        <div className="flex gap-1">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === idx ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white/60 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
