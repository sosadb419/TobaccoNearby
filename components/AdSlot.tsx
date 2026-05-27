type AdSlotProps = {
  placement: "header" | "sidebar" | "in-content" | "footer";
  label?: string;
};

const placementClasses = {
  header: "flex min-h-12",
  sidebar: "hidden min-h-32 lg:flex",
  "in-content": "flex min-h-16",
  footer: "flex min-h-14"
};

export default function AdSlot({ placement, label = "Advertisement" }: AdSlotProps) {
  return (
    <>
      {/* Future ad integration belongs inside this reserved box. Block tobacco, vape, nicotine,
          cannabis, alcohol, gambling and smoking-accessory advertising at the provider level. */}
      <aside
        aria-label={`${label} space`}
        data-ad-placement={placement}
        className={`w-full items-center justify-center rounded-lg border border-dashed border-line bg-white/60 px-3 py-2 text-center text-muted ${placementClasses[placement]}`}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase text-muted">{label}</p>
          <p className="sr-only">Reserved neutral ad space</p>
        </div>
      </aside>
    </>
  );
}
