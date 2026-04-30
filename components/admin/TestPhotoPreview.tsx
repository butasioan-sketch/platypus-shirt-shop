export default function TestPhotoPreview({
  beforePhoto,
  afterPhoto,
}: {
  beforePhoto?: string;
  afterPhoto?: string;
}) {
  if (!beforePhoto && !afterPhoto) return null;

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {beforePhoto && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <p className="mb-2 text-xs font-black text-neutral-500">Vorher</p>
          <img
            src={beforePhoto}
            alt="Vorher Foto"
            className="h-56 w-full rounded-xl object-cover"
          />
        </div>
      )}

      {afterPhoto && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <p className="mb-2 text-xs font-black text-neutral-500">Nachher</p>
          <img
            src={afterPhoto}
            alt="Nachher Foto"
            className="h-56 w-full rounded-xl object-cover"
          />
        </div>
      )}
    </div>
  );
}
