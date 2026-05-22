import { Info } from "lucide-react";

type DisclaimerNoticeProps = {
  className?: string;
};

const disclaimerText =
  "Shop data may change. Please verify opening hours, accessibility details, contact information and product availability before visiting.";

export default function DisclaimerNotice({ className = "" }: DisclaimerNoticeProps) {
  return (
    <aside
      className={`rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted ${className}`}
      aria-label="Shop information disclaimer"
    >
      <div className="flex items-start gap-3">
        <Info aria-hidden="true" className="mt-1 shrink-0 text-teal" size={16} />
        <p>{disclaimerText}</p>
      </div>
    </aside>
  );
}
