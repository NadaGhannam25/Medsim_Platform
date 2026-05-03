import { type BodyRegionId, REGION_LABELS } from "@/data/clinical-cases";
import mannequinImg from "@/assets/mannequin.png";

type Props = {
  view: "front" | "back";
  selected: BodyRegionId[];
  expectedRegions?: BodyRegionId[];
  onToggle: (id: BodyRegionId) => void;
};

type RegionDef = { id: BodyRegionId; d: string };

// Regions mapped to the mannequin image proportions (viewBox 0 0 200 600)
const FRONT_REGIONS: RegionDef[] = [
  { id: "head-vertex", d: "M92 18 C98 8 112 8 118 18 L116 34 L94 34 Z" },
  { id: "head-right-frontal", d: "M82 36 C84 24 91 17 100 15 L100 52 L84 52 C82 46 81 41 82 36 Z" },
  { id: "head-left-frontal", d: "M100 15 C109 17 116 24 118 36 C119 41 118 46 116 52 L100 52 Z" },
  { id: "head-right-temporal", d: "M78 51 C78 42 80 37 84 33 L88 61 C82 62 79 58 78 51 Z" },
  { id: "head-left-temporal", d: "M116 33 C120 37 122 42 122 51 C121 58 118 62 112 61 Z" },
  { id: "face", d: "M87 52 L113 52 C112 70 107 80 100 82 C93 80 88 70 87 52 Z" },
  { id: "jaw", d: "M91 76 C96 82 104 82 109 76 L106 89 L94 89 Z" },
  { id: "neck-anterior", d: "M91 90 L109 90 L114 111 L86 111 Z" },
  { id: "shoulder-right", d: "M85 111 C69 113 57 121 50 137 L72 145 L89 126 Z" },
  { id: "shoulder-left", d: "M115 111 C131 113 143 121 150 137 L128 145 L111 126 Z" },
  { id: "chest-right-upper", d: "M73 143 C79 126 88 116 100 116 L100 171 L67 171 C67 160 69 150 73 143 Z" },
  { id: "chest-left-upper", d: "M100 116 C112 116 121 126 127 143 C131 150 133 160 133 171 L100 171 Z" },
  { id: "chest-central", d: "M91 124 L109 124 L113 190 L87 190 Z" },
  { id: "chest-lower", d: "M68 171 L132 171 L126 208 L74 208 Z" },
  { id: "abdomen-epigastric", d: "M78 209 L122 209 L118 235 L82 235 Z" },
  { id: "abdomen-ruq", d: "M70 209 L100 209 L100 241 L75 241 Z" },
  { id: "abdomen-luq", d: "M100 209 L130 209 L125 241 L100 241 Z" },
  { id: "abdomen-umbilical", d: "M77 235 L123 235 L121 268 L79 268 Z" },
  { id: "abdomen-rlq", d: "M75 268 L100 268 L100 300 L70 300 Z" },
  { id: "abdomen-llq", d: "M100 268 L125 268 L130 300 L100 300 Z" },
  { id: "suprapubic", d: "M70 300 L130 300 L119 328 L81 328 Z" },
  { id: "pelvis-right", d: "M69 304 L100 328 L88 351 L62 331 Z" },
  { id: "pelvis-left", d: "M100 328 L131 304 L138 331 L112 351 Z" },
  { id: "upper-arm-right", d: "M50 138 L70 146 L60 223 L43 219 C42 184 44 158 50 138 Z" },
  { id: "upper-arm-left", d: "M150 138 C156 158 158 184 157 219 L140 223 L130 146 Z" },
  { id: "forearm-right", d: "M43 219 L60 223 L58 286 L40 288 C38 264 39 239 43 219 Z" },
  { id: "forearm-left", d: "M140 223 L157 219 C161 239 162 264 160 288 L142 286 Z" },
  { id: "hand-right", d: "M40 288 L58 286 L61 319 C56 326 45 326 38 317 Z" },
  { id: "hand-left", d: "M142 286 L160 288 L162 317 C155 326 144 326 139 319 Z" },
  { id: "thigh-right", d: "M70 330 L99 330 L94 432 L74 432 C66 394 64 361 70 330 Z" },
  { id: "thigh-left", d: "M101 330 L130 330 C136 361 134 394 126 432 L106 432 Z" },
  { id: "knee-right", d: "M74 432 L94 432 L93 462 L74 462 Z" },
  { id: "knee-left", d: "M106 432 L126 432 L126 462 L107 462 Z" },
  { id: "lower-leg-right", d: "M74 462 L93 462 L90 552 L70 552 C68 519 69 489 74 462 Z" },
  { id: "lower-leg-left", d: "M107 462 L126 462 C131 489 132 519 130 552 L110 552 Z" },
  { id: "foot-right", d: "M70 552 L90 552 L96 579 L58 584 C57 569 61 558 70 552 Z" },
  { id: "foot-left", d: "M110 552 L130 552 C139 558 143 569 142 584 L104 579 Z" },
];

const BACK_REGIONS: RegionDef[] = [
  { id: "head-occipital", d: "M82 36 C83 19 94 10 100 10 C106 10 117 19 118 36 L114 72 C109 82 91 82 86 72 Z" },
  { id: "head-vertex", d: "M91 17 C96 8 104 8 109 17 L112 35 L88 35 Z" },
  { id: "neck-posterior", d: "M90 82 L110 82 L115 112 L85 112 Z" },
  { id: "shoulder-left", d: "M85 112 C68 114 56 122 49 138 L72 146 L90 126 Z" },
  { id: "shoulder-right", d: "M115 112 C132 114 144 122 151 138 L128 146 L110 126 Z" },
  { id: "upper-back-left", d: "M67 145 C75 125 88 116 100 116 L100 177 L68 177 Z" },
  { id: "upper-back-right", d: "M100 116 C112 116 125 125 133 145 L132 177 L100 177 Z" },
  { id: "mid-back-left", d: "M68 177 L100 177 L100 242 L72 242 Z" },
  { id: "mid-back-right", d: "M100 177 L132 177 L128 242 L100 242 Z" },
  { id: "lower-back-left", d: "M72 242 L100 242 L100 304 L70 304 Z" },
  { id: "lower-back-right", d: "M100 242 L128 242 L130 304 L100 304 Z" },
  { id: "sacral", d: "M74 304 L126 304 L116 333 L84 333 Z" },
  { id: "buttock-left", d: "M66 324 C77 310 92 312 100 333 L92 365 L66 354 Z" },
  { id: "buttock-right", d: "M100 333 C108 312 123 310 134 324 L134 354 L108 365 Z" },
  { id: "upper-arm-left", d: "M49 138 L70 146 L60 224 L43 220 C42 185 44 158 49 138 Z" },
  { id: "upper-arm-right", d: "M151 138 C156 158 158 185 157 220 L140 224 L130 146 Z" },
  { id: "forearm-left", d: "M43 220 L60 224 L58 286 L40 288 C38 264 39 240 43 220 Z" },
  { id: "forearm-right", d: "M140 224 L157 220 C161 240 162 264 160 288 L142 286 Z" },
  { id: "hand-left", d: "M40 288 L58 286 L61 319 C56 326 45 326 38 317 Z" },
  { id: "hand-right", d: "M142 286 L160 288 L162 317 C155 326 144 326 139 319 Z" },
  { id: "thigh-left", d: "M68 356 L99 356 L94 432 L74 432 C66 403 64 378 68 356 Z" },
  { id: "thigh-right", d: "M101 356 L132 356 C136 378 134 403 126 432 L106 432 Z" },
  { id: "knee-left", d: "M74 432 L94 432 L93 462 L74 462 Z" },
  { id: "knee-right", d: "M106 432 L126 432 L126 462 L107 462 Z" },
  { id: "lower-leg-left", d: "M74 462 L93 462 L90 552 L70 552 C68 519 69 489 74 462 Z" },
  { id: "lower-leg-right", d: "M107 462 L126 462 C131 489 132 519 130 552 L110 552 Z" },
  { id: "foot-left", d: "M70 552 L90 552 L96 579 L58 584 C57 569 61 558 70 552 Z" },
  { id: "foot-right", d: "M110 552 L130 552 C139 558 143 569 142 584 L104 579 Z" },
];

const FILL_SELECTED = "rgba(239, 68, 68, 0.35)";
const FILL_MATCH = "rgba(34, 197, 94, 0.35)";
const FILL_HOVER = "rgba(59, 130, 246, 0.2)";
const STROKE_SELECTED = "rgba(239, 68, 68, 0.6)";
const STROKE_MATCH = "rgba(34, 197, 94, 0.6)";
const STROKE_DEFAULT = "transparent";

export function BodyMap({ view, selected, expectedRegions = [], onToggle }: Props) {
  const regions = view === "front" ? FRONT_REGIONS : BACK_REGIONS;
  const isSelected = (id: BodyRegionId) => selected.includes(id);
  const isMatch = (id: BodyRegionId) => isSelected(id) && expectedRegions.includes(id);

  const fillFor = (id: BodyRegionId) =>
    isMatch(id) ? FILL_MATCH : isSelected(id) ? FILL_SELECTED : "transparent";

  const strokeFor = (id: BodyRegionId) =>
    isMatch(id) ? STROKE_MATCH : isSelected(id) ? STROKE_SELECTED : STROKE_DEFAULT;

  return (
    <div className="relative mx-auto w-full max-w-[390px]">
      {/* Mannequin image as background */}
      <img
        src={mannequinImg}
        alt={view === "front" ? "نموذج جسم أمامي" : "نموذج جسم خلفي"}
        className="w-full h-auto select-none pointer-events-none"
        draggable={false}
        style={view === "back" ? { transform: "scaleX(-1)" } : undefined}
      />
      {/* Invisible interactive SVG overlay */}
      <svg
        viewBox="0 0 200 600"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={view === "front" ? "نموذج جسم أمامي تفاعلي" : "نموذج جسم خلفي تفاعلي"}
      >
        {regions.map(({ id, d }) => (
          <path
            key={id}
            d={d}
            fill={fillFor(id)}
            stroke={strokeFor(id)}
            strokeWidth={1.2}
            className="cursor-pointer transition-all duration-150 outline-none"
            tabIndex={0}
            role="button"
            aria-pressed={isSelected(id)}
            aria-label={REGION_LABELS[id]}
            onClick={() => onToggle(id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(id);
              }
            }}
            onMouseEnter={(e) => {
              if (!isSelected(id))
                (e.currentTarget as SVGPathElement).setAttribute("fill", FILL_HOVER);
            }}
            onMouseLeave={(e) => {
              if (!isSelected(id))
                (e.currentTarget as SVGPathElement).setAttribute("fill", "transparent");
            }}
          >
            <title>{REGION_LABELS[id]}</title>
          </path>
        ))}
      </svg>
    </div>
  );
}
