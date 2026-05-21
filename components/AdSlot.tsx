type AdSlotProps = {
  placement: "header" | "sidebar" | "in-content" | "footer";
  label?: string;
};

const placementClasses = {
  header: "min-h-24 md:min-h-[90px]",
  sidebar: "min-h-[280px]",
  "in-content": "min-h-[120px]",
  footer: "min-h-24"
};

export default function AdSlot({ placement, label = "Advertisement" }: AdSlotProps) {
  return (
    <aside
      aria-label={`${label} placement`}
      className={`flex w-full items-center justify-center rounded-lg border border-dashed border-line bg-white/70 p-4 text-center text-sm text-muted ${placementClasses[placement]}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase text-muted">{label}</p>
        <p className="mt-2 max-w-xs text-xs leading-5">
          Reserved neutral ad space. Tobacco product advertising should be blocked.
        </p>
      </div>
    </aside>
  );
}
