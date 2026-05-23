type AdSlotProps = {
  placement: "header" | "sidebar" | "in-content" | "footer";
  label?: string;
};

const placementClasses = {
  header: "flex min-h-[64px] sm:min-h-[76px] lg:min-h-[90px]",
  sidebar: "hidden min-h-[300px] lg:flex",
  "in-content": "flex min-h-[112px] sm:min-h-[120px]",
  footer: "flex min-h-[80px] sm:min-h-[96px]"
};

export default function AdSlot({ placement, label = "Advertisement" }: AdSlotProps) {
  return (
    <>
      {/* Future ad integration belongs inside this reserved box. Block tobacco, vape, nicotine,
          cannabis, alcohol, gambling and smoking-accessory advertising at the provider level. */}
      <aside
        aria-label={`${label} space`}
        data-ad-placement={placement}
        className={`w-full items-center justify-center rounded-lg border border-line bg-paper/70 px-4 py-3 text-center text-muted ${placementClasses[placement]}`}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase text-muted">{label}</p>
          <p className="mt-1.5 text-xs leading-5">Reserved neutral ad space</p>
        </div>
      </aside>
    </>
  );
}
