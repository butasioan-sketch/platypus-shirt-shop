import Link from "next/link";

export default function AdminQuickLinks() {
  const links = [
    { href: "/admin", label: "Bestellungen" },
    { href: "/admin/tests", label: "Waschtests" },
    { href: "/admin/inventory", label: "Lager" },
    { href: "/admin/newsletter", label: "Newsletter" },
    { href: "/admin/viewer-notes", label: "Viewer Notes" },
  ];

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-2xl bg-black px-5 py-3 font-black text-white active:scale-[0.98]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
