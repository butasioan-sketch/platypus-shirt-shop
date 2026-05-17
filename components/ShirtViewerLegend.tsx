export default function ShirtViewerLegend() {
  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Viewer Details
      </p>

      <div className="mt-3 grid gap-2 text-xs font-bold text-neutral-700 sm:grid-cols-2">
        <p>• Auto-Rotation für schnelle Vorschau</p>
        <p>• Drag/Touch für manuelle Kontrolle</p>
        <p>• Vorderseite und Rückseite sichtbar</p>
        <p>• Stoffstruktur, Licht und Schatten aktiv</p>
      </div>
    </div>
  );
}
