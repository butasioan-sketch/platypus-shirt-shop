"use client";

export default function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  function handleFile(file?: File) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="mb-2 text-sm font-black">{label}</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm"
      />

      {value && (
        <img
          src={value}
          alt={label}
          className="mt-3 h-40 w-full rounded-xl object-cover"
        />
      )}
    </div>
  );
}
