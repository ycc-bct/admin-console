// Deterministic soft color palette based on name
const PALETTES = [
  { bg: "rgba(252,194,160,0.6)", text: "#7A3010" },   // warm peach
  { bg: "rgba(196,176,232,0.6)", text: "#4A2C8A" },   // soft purple
  { bg: "#F5F3FF",               text: "#5B3FA6" },   // light lavender (full opacity)
  { bg: "rgba(142,202,230,0.6)", text: "#1A4A6B" },   // soft sky blue
  { bg: "#CCE8D7",               text: "#1A5C3A" },   // soft sage green
  { bg: "rgba(240,176,196,0.6)", text: "#8B2040" },   // soft rose
  { bg: "#F5F3FF",               text: "#5B3FA6" },   // light lavender (full opacity)
  { bg: "rgba(244,200,90,0.6)",  text: "#6B4000" },   // warm amber
  { bg: "rgba(168,216,188,0.6)", text: "#1A5C3A" },   // soft mint
  { bg: "rgba(212,184,240,0.6)", text: "#52248A" },   // light violet
];

function getPalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

interface Props {
  name: string;
  size?: "sm" | "md";
}

export default function UserAvatar({ name, size = "md" }: Props) {
  const { bg, text } = getPalette(name);
  const initials = name
    .split(/[\s-_]/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center flex-shrink-0 font-normal tracking-wide`}
      style={{ backgroundColor: bg, color: text }}
    >
      {initials}
    </div>
  );
}
