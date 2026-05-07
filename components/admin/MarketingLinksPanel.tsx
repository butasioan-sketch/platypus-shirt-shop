export default function MarketingLinksPanel() {
  const links = [
    {
      label: "Shop",
      url: "https://platypus-shirt-shop.vercel.app",
    },
    {
      label: "Versand",
      url: "https://platypus-shirt-shop.vercel.app/versand",
    },
    {
      label: "Admin",
      url: "https://platypus-shirt-shop.vercel.app/admin",
    },
    {
      label: "Produkte",
      url: "https://platypus-shirt-shop.vercel.app/#produkte",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Marketing Links
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Schnell teilen und testen
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 font-black hover:bg-black hover:text-white transition"
          >
            {link.label}
            <p className="mt-1 break-all text-xs font-bold opacity-60">
              {link.url}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
