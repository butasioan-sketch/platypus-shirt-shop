"use client";

export default function ShirtViewerSnapshotButton() {
  function saveNote() {
    const note = {
      type: "viewer_snapshot_note",
      createdAt: new Date().toISOString(),
      message: "Viewer-Snapshot manuell prüfen und Produktbild dokumentieren.",
    };

    const existing = JSON.parse(localStorage.getItem("platypus-viewer-notes") || "[]");
    localStorage.setItem("platypus-viewer-notes", JSON.stringify([...existing, note]));

    alert("Viewer-Notiz gespeichert.");
  }

  return (
    <button
      onClick={saveNote}
      className="absolute right-5 top-28 z-20 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-xl"
    >
      Snapshot
    </button>
  );
}
