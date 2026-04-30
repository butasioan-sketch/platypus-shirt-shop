export default function ProductBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-black text-neutral-700 border border-neutral-200">
      {label}
    </span>
  );
}
