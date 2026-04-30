import { socialChannels } from "../data/social";

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {socialChannels.filter((s) => s.enabled).map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-black"
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}
