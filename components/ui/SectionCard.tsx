export default function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[2rem] bg-white border border-neutral-200 shadow-xl ${className}`}>
      {children}
    </div>
  );
}
