export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-zinc-500 flex flex-col md:flex-row justify-between gap-4">
        <div>© {new Date().getFullYear()} PLATYPUS. Alle Rechte vorbehalten.</div>
        <div className="flex gap-6">
          <a href="/impressum" className="hover:text-white transition">Impressum</a>
          <span>·</span>
          <a href="/agb" className="hover:text-white transition">AGB</a>
          <span>·</span>
          <a href="/datenschutz" className="hover:text-white transition">Datenschutz</a>
          <span>·</span>
          <a href="/versand" className="hover:text-white transition">Versand</a>
        </div>
      </div>
    </footer>
  );
}
