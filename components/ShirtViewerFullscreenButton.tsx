"use client";

export default function ShirtViewerFullscreenButton() {
  function openViewer() {
    const viewer = document.querySelector("[data-shirt-viewer]");
    if (viewer && "requestFullscreen" in viewer) {
      viewer.requestFullscreen();
    }
  }

  return (
    <button
      onClick={openViewer}
      className="absolute right-5 top-16 z-20 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-black shadow-xl"
    >
      Vollbild
    </button>
  );
}
