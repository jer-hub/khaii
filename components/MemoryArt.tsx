import type { ArtMotif } from "@/data/content";

export function MemoryArt({ motif }: { motif: ArtMotif }) {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden>
      {motif === "coffee" && <CoffeeScene />}
      {motif === "rain" && <RainScene />}
      {motif === "sunset" && <SunsetScene />}
      {motif === "picnic" && <PicnicScene />}
      {motif === "stars" && <StarsScene />}
      {motif === "home" && <HomeScene />}
      {motif === "heart" && <HeartScene />}
      {motif === "ring" && <RingScene />}
    </svg>
  );
}

function CoffeeScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#F6EDE4" />
      <circle cx="160" cy="36" r="28" fill="#F4C2C2" opacity="0.7" />
      <rect x="0" y="168" width="200" height="72" fill="#D9C4B0" />
      <rect x="28" y="128" width="144" height="12" rx="3" fill="#C4A992" />
      <ellipse cx="88" cy="156" rx="34" ry="10" fill="#B08968" />
      <path d="M62 156c0-28 12-52 26-52s26 24 26 52" fill="#F3E6D8" stroke="#8C6448" strokeWidth="3" />
      <ellipse cx="88" cy="108" rx="22" ry="7" fill="#6F4E37" />
      <path d="M128 128c18 4 28 18 20 32" fill="none" stroke="#C4A992" strokeWidth="6" />
      <path d="M78 86c4-14 14-18 18-8" fill="none" stroke="#A9B8A9" strokeWidth="3" strokeLinecap="round" />
      <path d="M92 82c3-12 12-16 16-6" fill="none" stroke="#A9B8A9" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function RainScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#E7EEE8" />
      <path d="M0 168h200v72H0z" fill="#A9B8A9" opacity="0.55" />
      {[28, 58, 90, 122, 154, 176].map((x) => (
        <line
          key={x}
          x1={x}
          y1="24"
          x2={x - 8}
          y2="96"
          stroke="#7E917E"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      ))}
      <circle cx="100" cy="150" r="36" fill="#F4C2C2" />
      <rect x="96" y="150" width="8" height="28" fill="#5C5854" />
      <path d="M48 168c20-40 84-40 104 0" fill="#F4C2C2" />
    </g>
  );
}

function SunsetScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#F8E4D4" />
      <circle cx="100" cy="118" r="42" fill="#F4C2C2" />
      <path d="M0 150c28-18 58-18 86 0 28 18 62 18 114 0v90H0z" fill="#A9B8A9" />
      <path d="M72 168c6-22 18-34 28-34s22 12 28 34" fill="#2C2C2C" opacity="0.72" />
      <circle cx="88" cy="148" r="5" fill="#2C2C2C" opacity="0.72" />
      <circle cx="112" cy="148" r="5" fill="#2C2C2C" opacity="0.72" />
    </g>
  );
}

function PicnicScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#F3F6F1" />
      <circle cx="36" cy="40" r="22" fill="#F4C2C2" opacity="0.55" />
      <path d="M0 120h200v120H0z" fill="#A9B8A9" />
      <path d="M20 128l160 0 12 84H8z" fill="#FAF9F6" />
      <path d="M20 128l40 84H8z" fill="#F4C2C2" opacity="0.7" />
      <path d="M100 128l40 84H60z" fill="#F4C2C2" opacity="0.7" />
      <ellipse cx="86" cy="168" rx="22" ry="10" fill="#C4A992" />
      <rect x="74" y="148" width="24" height="20" rx="4" fill="#8C6448" />
      <circle cx="132" cy="172" r="10" fill="#E39A9A" />
      <circle cx="148" cy="178" r="7" fill="#7E917E" />
    </g>
  );
}

function StarsScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#3D3A48" />
      <circle cx="42" cy="46" r="3" fill="#FAF9F6" />
      <circle cx="88" cy="28" r="2" fill="#F4C2C2" />
      <circle cx="150" cy="54" r="2.5" fill="#FAF9F6" />
      <circle cx="168" cy="92" r="2" fill="#A9B8A9" />
      <circle cx="60" cy="88" r="1.8" fill="#FAF9F6" />
      <circle cx="118" cy="70" r="4" fill="#FAF9F6" opacity="0.9" />
      <path d="M0 168c40-36 90-36 200-8v80H0z" fill="#2C2C2C" />
      <rect x="70" y="128" width="60" height="40" rx="6" fill="#5C5854" />
      <polygon points="64,128 100,104 136,128" fill="#A9B8A9" />
      <rect x="94" y="144" width="12" height="24" fill="#F4C2C2" />
    </g>
  );
}

function HomeScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#F7EFE6" />
      <rect x="0" y="170" width="200" height="70" fill="#D8C3B0" />
      <rect x="38" y="86" width="124" height="96" fill="#FAF9F6" stroke="#C4A992" strokeWidth="4" />
      <polygon points="30,90 100,42 170,90" fill="#A9B8A9" />
      <rect x="86" y="132" width="28" height="50" fill="#8C6448" />
      <rect x="54" y="108" width="26" height="26" fill="#F4C2C2" />
      <rect x="120" y="108" width="26" height="26" fill="#F4C2C2" />
      <path d="M150 170c8-22 22-22 30 0" fill="#7E917E" />
    </g>
  );
}

function HeartScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#F7E8E6" />
      <circle cx="40" cy="44" r="26" fill="#F4C2C2" opacity="0.55" />
      <circle cx="168" cy="200" r="36" fill="#A9B8A9" opacity="0.35" />
      <path
        d="M100 188s-44-28-58-56c-10-20-4-44 18-48 14-2 26 6 32 18 6-12 18-20 32-18 22 4 28 28 18 48-14 28-58 56-58 56z"
        fill="#E39A9A"
      />
    </g>
  );
}

function RingScene() {
  return (
    <g>
      <rect width="200" height="240" fill="#F3F6F1" />
      <circle cx="150" cy="48" r="22" fill="#F4C2C2" opacity="0.5" />
      <circle cx="100" cy="128" r="52" fill="none" stroke="#C4A992" strokeWidth="10" />
      <circle cx="100" cy="128" r="36" fill="none" stroke="#E39A9A" strokeWidth="6" />
      <path d="M100 70l6 16 18 2-14 12 4 18-14-10-14 10 4-18-14-12 18-2z" fill="#A9B8A9" />
    </g>
  );
}
