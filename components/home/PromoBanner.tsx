import Link from "next/link";

interface BannerProps {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  reverse?: boolean;
}

export default function PromoBanner({ title, subtitle, cta, href, image, reverse }: BannerProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} rounded-3xl overflow-hidden min-h-64`}>
        <div className="relative md:w-1/2 h-64 md:h-auto">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="md:w-1/2 bg-[#1a1a1a] text-white flex items-center justify-center p-10 md:p-16" dir="rtl">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{subtitle}</p>
            <h3 className="text-3xl md:text-4xl font-black leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h3>
            <Link
              href={href}
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
