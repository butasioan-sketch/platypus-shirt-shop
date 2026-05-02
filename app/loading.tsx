export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#f6f3ed]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-black text-black">Lade Shop...</p>
      </div>
    </div>
  );
}
