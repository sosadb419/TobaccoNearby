export type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items: FAQItem[];
  title?: string;
  intro?: string;
  id?: string;
  className?: string;
  includeSchema?: boolean;
};

export default function FAQSection({
  items,
  title = "FAQ",
  intro,
  id = "faq",
  className = "",
  includeSchema = true
}: FAQSectionProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <section className={`rounded-lg border border-line bg-white p-5 ${className}`} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-lg font-bold text-ink">
        {title}
      </h2>
      {intro ? <p className="mt-2 text-sm leading-6 text-muted">{intro}</p> : null}
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-lg border border-line bg-paper px-4 py-3">
            <summary className="focus-ring cursor-pointer list-none rounded-md text-sm font-bold text-ink marker:hidden">
              <span className="flex items-start justify-between gap-4">
                <span>{item.question}</span>
                <span aria-hidden="true" className="mt-0.5 text-muted transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 border-t border-line pt-3 text-sm leading-6 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
      {includeSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ) : null}
    </section>
  );
}
