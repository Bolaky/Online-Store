"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/lang";

export interface HeroSlide {
  id:       string | number;
  title:    string;
  subtitle: string;
  cta:      string;
  href:     string;
  bg:       string;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title:    "مجموعة الصيف الجديدة",
    subtitle: "أناقة لا حدود لها",
    cta:      "تسوقي الآن",
    href:     "/",
    bg:       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
  },
];

interface Props {
  slides?: HeroSlide[];
}

export default function HeroSlider({ slides: propSlides }: Props) {
  const slides = propSlides?.length ? propSlides : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const { lang } = useLang();

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[60vh] md:h-[85vh] overflow-hidden bg-gray-100">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.bg}
            alt={slide.title}
            fill
            className="object-cover object-top"
            priority={i === current}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />
          <div
            className="absolute inset-0 flex items-center justify-end"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className={`text-white max-w-lg ${lang === "ar" ? "pr-8 md:pr-20" : "pl-8 md:pl-20"}`}>
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

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors ${
              lang === "ar" ? "right-4" : "left-4"
            }`}
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors ${
              lang === "ar" ? "left-4" : "right-4"
            }`}
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
