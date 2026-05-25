interface PolicyPageProps {
  title: string;
  body?: string;
  fallback: string;
}

export default function PolicyPage({ title, body, fallback }: PolicyPageProps) {
  const content = body?.trim() || fallback;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14" dir="rtl">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
        {title}
      </h1>
      <div className="prose prose-gray max-w-none">
        {content.split(/\n+/).map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-8 mb-4 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
