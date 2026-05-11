import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({
  size = "normal",
}: {
  size?: "small" | "normal" | "large";
}) {
  const dimensions = {
    small: "h-10 w-10",
    normal: "h-14 w-14",
    large: "h-28 w-28",
  };

  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className={`relative overflow-hidden rounded-full bg-black ${dimensions[size]}`}>
        <Image
          src="/brand/logo.jpeg"
          alt="PLATYPUS Logo"
          fill
          priority
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div>
        <p className="text-lg font-black leading-none">PLATYPUS</p>
        <p className="text-xs font-bold text-neutral-500">
          Print Studio
        </p>
      </div>
    </Link>
  );
}
