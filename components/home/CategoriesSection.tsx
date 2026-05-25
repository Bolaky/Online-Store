// components/home/CategoriesSection.tsx

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

interface Props {
  categories: Category[];
  title?: string;
}

export default function CategoriesSection({ categories, title }: Props) {
  if (!categories.length) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" dir="inherit">
      <div className="text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl aspect-square block"
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end p-5">
              <h3
                className="text-white font-black text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
