import { type BodyRegionId, REGION_LABELS } from "@/data/clinical-cases";

type Props = {
  view: "front" | "back";
  selected: BodyRegionId[];
  expectedRegions?: BodyRegionId[];
  onToggle: (id: BodyRegionId) => void;
};

// Region styling helpers
const FILL_DEFAULT = "hsl(210 40% 92%)";
const FILL_HOVER = "hsl(210 80% 85%)";
const FILL_SELECTED = "hsl(0 75% 60%)";
const FILL_MATCH = "hsl(150 70% 45%)";
const STROKE = "hsl(215 25% 55%)";

export function BodyMap({ view, selected, expectedRegions = [], onToggle }: Props) {
  const isSelected = (id: BodyRegionId) => selected.includes(id);
  const isMatch = (id: BodyRegionId) => isSelected(id) && expectedRegions.includes(id);

  const fillFor = (id: BodyRegionId) =>
    isMatch(id) ? FILL_MATCH : isSelected(id) ? FILL_SELECTED : FILL_DEFAULT;

  // Reusable region renderer
  const Region = ({ id, d, label }: { id: BodyRegionId; d: string; label?: string }) => (
    <g className="cursor-pointer transition-all duration-200" onClick={() => onToggle(id)}>
      <title>{label ?? REGION_LABELS[id]}</title>
      <path
        d={d}
        fill={fillFor(id)}
        stroke={STROKE}
        strokeWidth={1.2}
        className="transition-all hover:brightness-95"
        style={{
          filter: isSelected(id) ? "drop-shadow(0 2px 8px rgba(220,38,38,0.4))" : undefined,
        }}
        onMouseEnter={(e) => {
          if (!isSelected(id)) (e.target as SVGPathElement).setAttribute("fill", FILL_HOVER);
        }}
        onMouseLeave={(e) => {
          if (!isSelected(id)) (e.target as SVGPathElement).setAttribute("fill", FILL_DEFAULT);
        }}
      />
    </g>
  );

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 200 460" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Soft body silhouette backdrop */}
        <defs>
          <radialGradient id="bodyGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="hsl(210 60% 97%)" />
            <stop offset="100%" stopColor="hsl(210 30% 92%)" />
          </radialGradient>
        </defs>

        {view === "front" ? (
          <>
            {/* Head */}
            <Region id="head" d="M100,8 C82,8 70,22 70,42 C70,60 82,74 100,74 C118,74 130,60 130,42 C130,22 118,8 100,8 Z" />
            {/* Neck */}
            <Region id="neck" d="M88,74 L112,74 L114,90 L86,90 Z" />
            {/* Shoulders */}
            <Region id="shoulder-right" d="M86,90 L60,98 L52,118 L72,120 L86,108 Z" />
            <Region id="shoulder-left" d="M114,90 L140,98 L148,118 L128,120 L114,108 Z" />
            {/* Chest */}
            <Region id="chest" d="M72,108 L128,108 L132,160 L68,160 Z" />
            {/* Abdomen */}
            <Region id="abdomen" d="M68,160 L132,160 L130,210 L70,210 Z" />
            {/* Pelvis */}
            <Region id="pelvis" d="M70,210 L130,210 L134,250 L66,250 Z" />
            {/* Arms */}
            <Region id="arm-right" d="M52,118 L42,180 L48,230 L62,230 L66,178 L72,120 Z" />
            <Region id="arm-left" d="M148,118 L158,180 L152,230 L138,230 L134,178 L128,120 Z" />
            {/* Hands */}
            <Region id="hand-right" d="M48,230 L62,230 L64,260 L46,260 Z" />
            <Region id="hand-left" d="M138,230 L152,230 L154,260 L136,260 Z" />
            {/* Legs */}
            <Region id="leg-right" d="M66,250 L100,250 L98,360 L80,400 L66,400 L62,330 Z" />
            <Region id="leg-left" d="M100,250 L134,250 L138,330 L134,400 L120,400 L102,360 Z" />
            {/* Feet */}
            <Region id="foot-right" d="M66,400 L80,400 L84,425 L60,430 L58,418 Z" />
            <Region id="foot-left" d="M120,400 L134,400 L142,418 L140,430 L116,425 Z" />
          </>
        ) : (
          <>
            {/* Back view */}
            <Region id="head" d="M100,8 C82,8 70,22 70,42 C70,60 82,74 100,74 C118,74 130,60 130,42 C130,22 118,8 100,8 Z" label="مؤخرة الرأس" />
            <Region id="neck" d="M88,74 L112,74 L114,90 L86,90 Z" label="مؤخرة الرقبة" />
            <Region id="shoulder-left" d="M86,90 L60,98 L52,118 L72,120 L86,108 Z" />
            <Region id="shoulder-right" d="M114,90 L140,98 L148,118 L128,120 L114,108 Z" />
            {/* Upper back */}
            <Region id="upper-back" d="M72,108 L128,108 L132,170 L68,170 Z" />
            {/* Lower back */}
            <Region id="lower-back" d="M68,170 L132,170 L130,220 L70,220 Z" />
            {/* Buttocks */}
            <Region id="buttocks" d="M70,220 L130,220 L134,260 L66,260 Z" />
            <Region id="arm-left" d="M52,118 L42,180 L48,230 L62,230 L66,178 L72,120 Z" />
            <Region id="arm-right" d="M148,118 L158,180 L152,230 L138,230 L134,178 L128,120 Z" />
            <Region id="hand-left" d="M48,230 L62,230 L64,260 L46,260 Z" />
            <Region id="hand-right" d="M138,230 L152,230 L154,260 L136,260 Z" />
            <Region id="leg-left" d="M66,260 L100,260 L98,370 L80,405 L66,405 L62,335 Z" />
            <Region id="leg-right" d="M100,260 L134,260 L138,335 L134,405 L120,405 L102,370 Z" />
            <Region id="foot-left" d="M66,405 L80,405 L84,425 L60,430 L58,418 Z" />
            <Region id="foot-right" d="M120,405 L134,405 L142,418 L140,430 L116,425 Z" />
          </>
        )}
      </svg>
    </div>
  );
}
