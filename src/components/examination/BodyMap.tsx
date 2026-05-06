import { useState, useCallback, useRef } from "react";
import { type BodyRegionId, REGION_LABELS } from "@/data/clinical-cases";
import mannequinImg from "@/assets/mannequin.png";

type Props = {
  view: "front" | "back";
  selected: BodyRegionId[];
  expectedRegions?: BodyRegionId[];
  closeRegions?: BodyRegionId[];
  onToggle: (id: BodyRegionId, click?: BodyClick) => void;
};

// Map percentage-based Y ranges to body region IDs
type ZoneMapping = { yMin: number; yMax: number; xMin: number; xMax: number; id: BodyRegionId };
export type BodyAccuracy = "correct" | "close" | "wrong";
export type BodyClick = { x: number; y: number; accuracy: BodyAccuracy };

const FRONT_ZONES: ZoneMapping[] = [
  { yMin: 0, yMax: 7, xMin: 30, xMax: 70, id: "head-vertex" },
  { yMin: 7, yMax: 14, xMin: 25, xMax: 50, id: "head-right-frontal" },
  { yMin: 7, yMax: 14, xMin: 50, xMax: 75, id: "head-left-frontal" },
  { yMin: 7, yMax: 12, xMin: 20, xMax: 30, id: "head-right-temporal" },
  { yMin: 7, yMax: 12, xMin: 70, xMax: 80, id: "head-left-temporal" },
  { yMin: 9, yMax: 15, xMin: 35, xMax: 65, id: "face" },
  { yMin: 13, yMax: 17, xMin: 38, xMax: 62, id: "jaw" },
  { yMin: 15, yMax: 20, xMin: 38, xMax: 62, id: "neck-anterior" },
  { yMin: 19, yMax: 26, xMin: 18, xMax: 40, id: "shoulder-right" },
  { yMin: 19, yMax: 26, xMin: 60, xMax: 82, id: "shoulder-left" },
  { yMin: 20, yMax: 30, xMin: 34, xMax: 50, id: "chest-right-upper" },
  { yMin: 20, yMax: 30, xMin: 50, xMax: 66, id: "chest-left-upper" },
  { yMin: 22, yMax: 32, xMin: 44, xMax: 56, id: "chest-central" },
  { yMin: 30, yMax: 36, xMin: 34, xMax: 66, id: "chest-lower" },
  { yMin: 36, yMax: 40, xMin: 36, xMax: 64, id: "abdomen-epigastric" },
  { yMin: 36, yMax: 42, xMin: 34, xMax: 50, id: "abdomen-ruq" },
  { yMin: 36, yMax: 42, xMin: 50, xMax: 66, id: "abdomen-luq" },
  { yMin: 40, yMax: 46, xMin: 36, xMax: 64, id: "abdomen-umbilical" },
  { yMin: 46, yMax: 52, xMin: 34, xMax: 50, id: "abdomen-rlq" },
  { yMin: 46, yMax: 52, xMin: 50, xMax: 66, id: "abdomen-llq" },
  { yMin: 50, yMax: 56, xMin: 36, xMax: 64, id: "suprapubic" },
  { yMin: 54, yMax: 60, xMin: 30, xMax: 50, id: "pelvis-right" },
  { yMin: 54, yMax: 60, xMin: 50, xMax: 70, id: "pelvis-left" },
  { yMin: 24, yMax: 40, xMin: 10, xMax: 30, id: "upper-arm-right" },
  { yMin: 24, yMax: 40, xMin: 70, xMax: 90, id: "upper-arm-left" },
  { yMin: 38, yMax: 50, xMin: 8, xMax: 26, id: "forearm-right" },
  { yMin: 38, yMax: 50, xMin: 74, xMax: 92, id: "forearm-left" },
  { yMin: 49, yMax: 56, xMin: 6, xMax: 24, id: "hand-right" },
  { yMin: 49, yMax: 56, xMin: 76, xMax: 94, id: "hand-left" },
  { yMin: 57, yMax: 74, xMin: 30, xMax: 50, id: "thigh-right" },
  { yMin: 57, yMax: 74, xMin: 50, xMax: 70, id: "thigh-left" },
  { yMin: 72, yMax: 78, xMin: 32, xMax: 50, id: "knee-right" },
  { yMin: 72, yMax: 78, xMin: 50, xMax: 68, id: "knee-left" },
  { yMin: 77, yMax: 92, xMin: 30, xMax: 50, id: "lower-leg-right" },
  { yMin: 77, yMax: 92, xMin: 50, xMax: 70, id: "lower-leg-left" },
  { yMin: 91, yMax: 100, xMin: 26, xMax: 50, id: "foot-right" },
  { yMin: 91, yMax: 100, xMin: 50, xMax: 74, id: "foot-left" },
];

const BACK_ZONES: ZoneMapping[] = [
  { yMin: 0, yMax: 14, xMin: 30, xMax: 70, id: "head-occipital" },
  { yMin: 0, yMax: 7, xMin: 35, xMax: 65, id: "head-vertex" },
  { yMin: 14, yMax: 20, xMin: 38, xMax: 62, id: "neck-posterior" },
  { yMin: 19, yMax: 26, xMin: 18, xMax: 40, id: "shoulder-left" },
  { yMin: 19, yMax: 26, xMin: 60, xMax: 82, id: "shoulder-right" },
  { yMin: 20, yMax: 32, xMin: 34, xMax: 50, id: "upper-back-left" },
  { yMin: 20, yMax: 32, xMin: 50, xMax: 66, id: "upper-back-right" },
  { yMin: 30, yMax: 42, xMin: 34, xMax: 50, id: "mid-back-left" },
  { yMin: 30, yMax: 42, xMin: 50, xMax: 66, id: "mid-back-right" },
  { yMin: 40, yMax: 52, xMin: 34, xMax: 50, id: "lower-back-left" },
  { yMin: 40, yMax: 52, xMin: 50, xMax: 66, id: "lower-back-right" },
  { yMin: 50, yMax: 56, xMin: 36, xMax: 64, id: "sacral" },
  { yMin: 54, yMax: 62, xMin: 30, xMax: 50, id: "buttock-left" },
  { yMin: 54, yMax: 62, xMin: 50, xMax: 70, id: "buttock-right" },
  { yMin: 24, yMax: 40, xMin: 10, xMax: 30, id: "upper-arm-left" },
  { yMin: 24, yMax: 40, xMin: 70, xMax: 90, id: "upper-arm-right" },
  { yMin: 38, yMax: 50, xMin: 8, xMax: 26, id: "forearm-left" },
  { yMin: 38, yMax: 50, xMin: 74, xMax: 92, id: "forearm-right" },
  { yMin: 49, yMax: 56, xMin: 6, xMax: 24, id: "hand-left" },
  { yMin: 49, yMax: 56, xMin: 76, xMax: 94, id: "hand-right" },
  { yMin: 60, yMax: 74, xMin: 30, xMax: 50, id: "thigh-left" },
  { yMin: 60, yMax: 74, xMin: 50, xMax: 70, id: "thigh-right" },
  { yMin: 72, yMax: 78, xMin: 32, xMax: 50, id: "knee-left" },
  { yMin: 72, yMax: 78, xMin: 50, xMax: 68, id: "knee-right" },
  { yMin: 77, yMax: 92, xMin: 30, xMax: 50, id: "lower-leg-left" },
  { yMin: 77, yMax: 92, xMin: 50, xMax: 70, id: "lower-leg-right" },
  { yMin: 91, yMax: 100, xMin: 26, xMax: 50, id: "foot-left" },
  { yMin: 91, yMax: 100, xMin: 50, xMax: 74, id: "foot-right" },
];

type Marker = { x: number; y: number; regionId: BodyRegionId };
type AccuracyMarker = Marker & { accuracy: BodyAccuracy };

function hitTest(xPct: number, yPct: number, zones: ZoneMapping[]): BodyRegionId | null {
  // Find smallest (most specific) zone that contains the click
  let best: ZoneMapping | null = null;
  let bestArea = Infinity;
  for (const z of zones) {
    if (xPct >= z.xMin && xPct <= z.xMax && yPct >= z.yMin && yPct <= z.yMax) {
      const area = (z.xMax - z.xMin) * (z.yMax - z.yMin);
      if (area < bestArea) {
        bestArea = area;
        best = z;
      }
    }
  }
  return best?.id ?? null;
}

function zoneDistance(xPct: number, yPct: number, zone: ZoneMapping) {
  const centerX = (zone.xMin + zone.xMax) / 2;
  const centerY = (zone.yMin + zone.yMax) / 2;
  return Math.hypot(xPct - centerX, yPct - centerY);
}

export function BodyMap({ view, selected, expectedRegions = [], closeRegions = [], onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<AccuracyMarker[]>([]);
  const zones = view === "front" ? FRONT_ZONES : BACK_ZONES;

  const classifyAccuracy = (id: BodyRegionId, xPct: number, yPct: number): BodyAccuracy => {
    if (expectedRegions.includes(id)) return "correct";
    const expectedZones = zones.filter((zone) => expectedRegions.includes(zone.id));
    const nearestExpected = expectedZones.length ? Math.min(...expectedZones.map((zone) => zoneDistance(xPct, yPct, zone))) : Infinity;
    if (closeRegions.includes(id) || nearestExpected <= 13) return "close";
    return "wrong";
  };

  const markerStyle = (accuracy: BodyAccuracy) => {
    const color = accuracy === "correct" ? "var(--accuracy-correct)" : accuracy === "close" ? "var(--accuracy-close)" : "var(--accuracy-wrong)";
    return {
      background: `radial-gradient(circle, color-mix(in oklch, ${color} 48%, transparent) 0%, color-mix(in oklch, ${color} 20%, transparent) 38%, transparent 72%)`,
      boxShadow: `0 0 0 1px color-mix(in oklch, ${color} 42%, transparent), 0 0 16px color-mix(in oklch, ${color} 36%, transparent)`,
    };
  };

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      const regionId = hitTest(xPct, yPct, zones);
      if (!regionId) return;
      const accuracy = classifyAccuracy(regionId, xPct, yPct);

      // Toggle: if already selected, remove marker and deselect
      if (selected.includes(regionId)) {
        setMarkers((prev) => prev.filter((m) => m.regionId !== regionId));
      } else {
        setMarkers((prev) => [...prev.filter((m) => m.regionId !== regionId), { x: xPct, y: yPct, regionId, accuracy }]);
      }
      onToggle(regionId, { x: xPct, y: yPct, accuracy });
    },
    [zones, selected, onToggle, expectedRegions, closeRegions],
  );

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[390px] cursor-crosshair select-none"
      onClick={handleClick}
    >
      {/* Mannequin image */}
      <img
        src={mannequinImg}
        alt={view === "front" ? "نموذج جسم أمامي" : "نموذج جسم خلفي"}
        className="w-full h-auto pointer-events-none"
        draggable={false}
        style={view === "back" ? { transform: "scaleX(-1)" } : undefined}
      />

      {/* Click markers — accuracy color only, no body segmentation */}
      {markers.map((marker) => {
        const color = marker.accuracy === "correct" ? "var(--accuracy-correct)" : marker.accuracy === "close" ? "var(--accuracy-close)" : "var(--accuracy-wrong)";
        return (
          <div
            key={marker.regionId}
            className="absolute pointer-events-none"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-10 w-10 rounded-full" style={markerStyle(marker.accuracy)} />
            <div
              className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
              style={{
                transform: "translate(-50%, -50%)",
                backgroundColor: color,
                boxShadow: `0 0 8px color-mix(in oklch, ${color} 60%, transparent)`,
              }}
            />
          </div>
        );
      })}

      {/* Region label tooltip on hover — invisible zones */}
      {zones.map((z) => (
        <div
          key={z.id}
          className="absolute"
          style={{
            left: `${z.xMin}%`,
            top: `${z.yMin}%`,
            width: `${z.xMax - z.xMin}%`,
            height: `${z.yMax - z.yMin}%`,
            pointerEvents: "none",
          }}
          title={REGION_LABELS[z.id]}
        />
      ))}
    </div>
  );
}
