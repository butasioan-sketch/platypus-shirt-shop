"use client";

export default function SocialShareBlock() {
  const url = "https://platypus-shirt-shop.vercel.app";
  const text = "PLATYPUS Shirt Shop · Premium T-Shirts in Schwarz & Weiß";

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Link kopieren",
      href: "#copy",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url);
    alert("Shop-Link kopiert.");
  }

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Teilen
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Zeig PLATYPUS deinen Freunden.
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {links.map((link) =>
          link.href === "#copy" ? (
            <button
              key={link.label}
              onClick={copyLink}
              className="rounded-2xl bg-black px-5 py-4 font-black text-white"
            >
              {link.label}
            </button>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              className="rounded-2xl bg-black px-5 py-4 text-center font-black text-white"
            >
              {link.label}
            </a>
          )
        )}
      </div>
    </div>
  );
}
