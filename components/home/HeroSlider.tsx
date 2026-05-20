"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "مجموعة الصيف الجديدة",
    subtitle: "أناقة لا حدود لها",
    cta: "تسوقي الآن",
    href: "/category/dresses",
    bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    accent: "#f5e6d3",
  },
  {
    id: 2,
    title: "إكسسوارات فاخرة",
    subtitle: "أكملي إطلالتك بلمسة من الأناقة",
    cta: "اكتشفي المجموعة",
    href: "/category/accessories",
    bg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80",
    accent: "#e8d5c4",
  },
  {
    id: 3,
    title: "تخفيضات حتى 40%",
    subtitle: "على مجموعة مختارة من الفساتين",
    cta: "تسوقي الآن",
    href: "/category/tops",
    bg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
    accent: "#d4e8d5",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[60vh] md:h-[85vh] overflow-hidden bg-gray-100">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.bg}
            alt={slide.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-end" dir="rtl">
            <div className="text-white pr-8 md:pr-20 max-w-lg">
              <p className="text-sm md:text-base font-medium tracking-widest uppercase mb-3 opacity-80">
                {slide.subtitle}
              </p>
              <h1
                className="text-4xl md:text-6xl font-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {slide.title}
              </h1>
              <Link
                href={slide.href}
                className="inline-block bg-white text-black font-bold px-8 py-3.5 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wide"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
