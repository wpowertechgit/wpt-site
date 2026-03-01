import { useMemo, useState, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Slider,
  Typography,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import {
  FaBolt,
  FaLeaf,
  FaCarSide,
  FaTree,
  FaIndustry,
  FaServer,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaInfoCircle,
  FaTimes,
  FaPlus,
  FaMinus,
  FaFlask,
  FaCheck,
  FaLayerGroup,
  FaClock,
} from "react-icons/fa";
import jsPDF from "jspdf";
import figtreeRegularTtfUrl from "../assets/fonts/Figtree/Figtree-Regular.ttf?url";
import figtreeSemiBoldTtfUrl from "../assets/fonts/Figtree/Figtree-SemiBold.ttf?url";
import stackRegularTtfUrl from "../assets/fonts/Stack/StackSansText-Regular.ttf?url";
import stackBoldTtfUrl from "../assets/fonts/Stack/StackSansText-Bold.ttf?url";

// ─── i18n helper ─────────────────────────────────────────────────────────────
// All UI strings go through tStr() so they get a translation key + English fallback.
// Usage: tStr(t, "key.name", "English fallback")
function tStr(t: (k: string) => string, key: string, fallback: string): string {
  const result = t(key);
  return result === key ? fallback : result;
}

function getWasteLabel(t: (k: string) => string, wasteType: WasteType): string {
  return wasteType.displayName?.trim() || tStr(t, wasteType.key, wasteType.key);
}

function getWasteTypicalSources(t: (k: string) => string, wasteType: WasteType): string {
  return tStr(t, `${wasteType.key}-sources`, wasteType.typicalSources);
}

// ─── Brand colours ────────────────────────────────────────────────────────────
const BRAND = { waste: "#8E8E8E", power: "#ED1C24", tech: "#0000FF" };

// ─── Physical constants ───────────────────────────────────────────────────────
// UPTIME: 24 × (365 − 10) = 8,520 h/yr (Cluj-CMID reference)
// MOISTURE CORRECTION: EN 14918 / ISO 1928
//   NCV_ar = HHV_dry × (1 − M/100) − 2.443 × (M/100)  [MJ/kg as-received]
//   2.443 MJ/kg = latent heat of vaporisation of water at 25°C
// ENERGY CONVERSION: 1 MWh = 3,600 MJ
//   MWh_electric = (Σ tonnes_i × 1000 × NCV_ar_i [MJ/kg]) / 3600 × η
// η = 21.18% — calibrated from WP1000: 1 t/h biomass (HHV 17 MJ/kg) → 1 MWh
const CONSTANTS = {
  annualHours: 8520,
  uptimePct: ((8520 / (365 * 24)) * 100).toFixed(1),
  mwhPerHousehold: 3.6,
  co2PerTonneAvoided: 0.30,
  treesPerTonneCO2: 45,
  co2PerCarYear: 1.284,
  generatorEfficiency: 0.2118,
  latentHeatWater: 2.443,
  MJ_PER_MWH: 3600,
};

// ─── Waste types ──────────────────────────────────────────────────────────────
export interface WasteType {
  key: string;
  image: string;
  hhvDry: number;
  defaultMoisture: number;
  color: string;
  characteristics: string[];
  typicalSources: string;
  displayName?: string;
  isCustom?: boolean;
  customComposition?: Record<string, number>; // key → % share
}

export const WASTE_TYPES: WasteType[] = [
  {
    key: "biomass",
    image: "/wasteTypes/biomass.png",
    hhvDry: 17,
    defaultMoisture: 60,
    color: "#4a7c59",
    characteristics: ["HHV (dry): 17 MJ/kg", "Typical moisture: 45–70%", "Renewable / carbon-neutral"],
    typicalSources: "Agricultural residues, forestry waste, food processing byproducts, garden clippings",
  },
  {
    key: "hydrocarbons",
    image: "/wasteTypes/hydrocarbons.png",
    hhvDry: 42,
    defaultMoisture: 2,
    color: "#7b4f12",
    characteristics: ["HHV (dry): 42 MJ/kg", "Typical moisture: <5%", "Very high energy density"],
    typicalSources: "Used motor oils, industrial lubricants, wax residues, petroleum sludge",
  },
  {
    key: "plastic",
    image: "/wasteTypes/plastic.png",
    hhvDry: 38,
    defaultMoisture: 3,
    color: "#1a6fa8",
    characteristics: ["HHV (dry): 38 MJ/kg", "Typical moisture: 1–5%", "Non-biodegradable"],
    typicalSources: "Packaging, containers, films, industrial plastic scrap, HDPE, LDPE, PP, PET",
  },
  {
    key: "textiles",
    image: "/wasteTypes/textile.png",
    hhvDry: 18,
    defaultMoisture: 12,
    color: "#8b5e83",
    characteristics: ["HHV (dry): 18 MJ/kg", "Typical moisture: 8–15%", "Mixed natural/synthetic"],
    typicalSources: "Discarded clothing, industrial cut-offs, upholstery, carpet fibres",
  },
  {
    key: "elastomers",
    image: "/wasteTypes/elastomers.png",
    hhvDry: 38,
    defaultMoisture: 2,
    color: "#2c2c2c",
    characteristics: ["HHV (dry): 38 MJ/kg", "Typical moisture: <5%", "High fixed carbon"],
    typicalSources: "End-of-life tyres, conveyor belts, industrial seals, shoe soles",
  },
  {
    key: "cellulosics",
    image: "/wasteTypes/cellulosics.png",
    hhvDry: 16,
    defaultMoisture: 15,
    color: "#c8a45a",
    characteristics: ["HHV (dry): 16 MJ/kg", "Typical moisture: 10–20%", "High oxygen content"],
    typicalSources: "Cardboard packaging, newsprint, office paper, wood pallets, sawdust",
  },
  {
    key: "carbon-resources",
    image: "/wasteTypes/carbon.png",
    hhvDry: 28,
    defaultMoisture: 8,
    color: "#3d3d3d",
    characteristics: ["HHV (dry): 28 MJ/kg", "Typical moisture: 5–12%", "High fixed carbon"],
    typicalSources: "Coal fines, petroleum coke, charcoal residues, activated carbon waste",
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function clampFloat(raw: string, min = 0, max = 99999): number {
  // Strip anything that isn't digits or a single decimal point
  const cleaned = raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function ncvAr(hhvDry: number, moisture: number): number {
  return Math.max(
    0,
    hhvDry * (1 - moisture / 100) - CONSTANTS.latentHeatWater * (moisture / 100)
  );
}

function computeWeightedHhvAndMoisture(
  composition: Record<string, number>
): { hhvDry: number; moisture: number } {
  let totalPct = 0;
  let weightedHhv = 0;
  let weightedMoisture = 0;
  Object.entries(composition).forEach(([key, pct]) => {
    const wt = WASTE_TYPES.find((w) => w.key === key);
    if (!wt || pct <= 0) return;
    totalPct += pct;
    weightedHhv += wt.hhvDry * pct;
    weightedMoisture += wt.defaultMoisture * pct;
  });
  if (totalPct === 0) return { hhvDry: 0, moisture: 0 };
  return { hhvDry: weightedHhv / totalPct, moisture: weightedMoisture / totalPct };
}

// ─── Mini Donut Chart (SVG) ───────────────────────────────────────────────────
function DonutChart({
  segments,
  size = 160,
}: {
  segments: { key: string; pct: number; color: string; label: string }[];
  size?: number;
}) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.17;
  const total = segments.reduce((s, seg) => s + seg.pct, 0);
  if (total === 0)
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px dashed #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.7rem", color: "#ccc" }}>0%</Typography>
      </Box>
    );

  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
        />
        {segments
          .filter((s) => s.pct > 0)
          .map((seg) => {
            const dash = (seg.pct / 100) * circumference;
            const gap = circumference - dash;
            const el = (
              <circle
                key={seg.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                style={{ transition: "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease" }}
              />
            );
            offset += dash;
            return el;
          })}
      </svg>
      {/* Centre label */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: size * 0.135, lineHeight: 1, color: "#1a1a1a" }}>
          {Math.round(total)}%
        </Typography>
        <Typography sx={{ fontSize: size * 0.075, color: "#aaa", mt: "0.1rem" }}>
          of 100%
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Custom Mix Builder ───────────────────────────────────────────────────────
interface CustomMixDraft {
  name: string;
  composition: Record<string, number>; // key → percent (0–100), must sum ≤ 100
  moisture: number; // override moisture %
}

function CustomMixBuilder({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (mix: WasteType) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<CustomMixDraft>({
    name: "",
    composition: Object.fromEntries(WASTE_TYPES.map((w) => [w.key, 0])),
    moisture: 15,
  });
  const [nameError, setNameError] = useState("");

  const totalPct = Object.values(draft.composition).reduce((s, v) => s + v, 0);
  const remaining = Math.max(0, 100 - totalPct);

  const segments = WASTE_TYPES.map((wt) => ({
    key: wt.key,
    pct: draft.composition[wt.key] ?? 0,
    color: wt.color,
    label: tStr(t, wt.key, wt.key),
  }));

  const { hhvDry: blendedHhv } = computeWeightedHhvAndMoisture(draft.composition);
  const blendedNcv = ncvAr(blendedHhv, draft.moisture);

  const setCompositionKey = useCallback((key: string, raw: string) => {
    const val = clampFloat(raw, 0, 100);
    setDraft((prev) => {
      const next = { ...prev.composition, [key]: val };
      const sum = Object.values(next).reduce((s, v) => s + v, 0);
      if (sum > 100) {
        // clamp this key so total doesn't exceed 100
        next[key] = Math.max(0, val - (sum - 100));
      }
      return { ...prev, composition: next };
    });
  }, []);

  const handleSave = () => {
    const trimmedName = draft.name.trim().replace(/[^a-zA-Z0-9 _\-]/g, "");
    if (!trimmedName) { setNameError(tStr(t, "calc.customMix.nameRequired", "Please enter a name")); return; }
    if (totalPct < 99) { return; } // Must be ~100%

    const { hhvDry: blendHhv } = computeWeightedHhvAndMoisture(draft.composition);

    const custom: WasteType = {
      key: `custom-${Date.now()}`,
      displayName: trimmedName,
      image: "/wasteTypes/custom.png",
      hhvDry: parseFloat(blendHhv.toFixed(2)),
      defaultMoisture: draft.moisture,
      color: "#555",
      isCustom: true,
      customComposition: { ...draft.composition },
      characteristics: [
        `HHV blended: ${blendHhv.toFixed(1)} MJ/kg`,
        `NCV_ar @ ${draft.moisture}% moisture: ${blendedNcv.toFixed(2)} MJ/kg`,
        `Composition: ${WASTE_TYPES.filter((w) => (draft.composition[w.key] ?? 0) > 0).map((w) => `${tStr(t, w.key, w.key)} ${draft.composition[w.key]}%`).join(", ")}`,
      ],
      typicalSources: tStr(t, "calc.customMix.customSourcesPlaceholder", "Custom user-defined composition"),
    };

    onSave(custom);
    // Reset
    setDraft({ name: "", composition: Object.fromEntries(WASTE_TYPES.map((w) => [w.key, 0])), moisture: 15 });
    setNameError("");
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: "0.75rem", px: "1.5rem", py: "1rem", borderBottom: "2px solid #000", flexShrink: 0 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaLayerGroup size={15} />
              <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "1rem", md: "1.2rem", xxl: "1.35rem", xxxl: "1.75rem" }, lineHeight: 1.1, overflowWrap: "anywhere" }}>
                {tStr(t, "calc.customMix.title", "Custom Waste Mix Builder")}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.73rem", xxl: "0.82rem", xxxl: "1rem" }, color: "#888", mt: "0.2rem", lineHeight: 1.5, overflowWrap: "anywhere" }}>
              {tStr(t, "calc.customMix.subtitle", "Define the composition of 1 tonne of mixed waste")}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ border: "2px solid #000", borderRadius: 0, p: "0.3rem" }}>
            <FaTimes size={13} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 220px" }, gap: 0 }}>
          {/* Left: composition inputs */}
          <Box sx={{ p: "1.25rem", borderRight: { md: "1px solid #eee" } }}>
            {/* Mix name */}
            <Box sx={{ mb: "1.1rem" }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.68rem", md: "0.72rem", xxl: "0.8rem", xxxl: "0.95rem" }, textTransform: "uppercase", letterSpacing: "0.09em", color: "#888", mb: "0.4rem" }}>
                {tStr(t, "calc.customMix.nameLabel", "Mix name")}
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={draft.name}
                onChange={(e) => {
                  const safe = e.target.value.replace(/[<>&"'/]/g, "").slice(0, 40);
                  setDraft((p) => ({ ...p, name: safe }));
                  setNameError("");
                }}
                placeholder={tStr(t, "calc.customMix.namePlaceholder", "e.g. Municipal MSW mix")}
                error={!!nameError}
                helperText={nameError}
                inputProps={{ maxLength: 40 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
              />
            </Box>

            {/* Progress bar */}
            <Box sx={{ mb: "1rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: "0.3rem" }}>
                <Typography sx={{ fontSize: { xs: "0.66rem", md: "0.7rem", xxl: "0.78rem", xxxl: "0.92rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>
                  {tStr(t, "calc.customMix.compositionLabel", "Composition")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.72rem", xxl: "0.82rem", xxxl: "0.98rem" }, fontWeight: 700, color: totalPct > 100 ? "#ED1C24" : totalPct === 100 ? "#4a7c59" : "#0000FF" }}>
                  {totalPct.toFixed(1)}% / 100%
                </Typography>
              </Box>
              <Box sx={{ height: 5, bgcolor: "#f0f0f0" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.min(100, totalPct)}%`,
                    bgcolor: totalPct > 100 ? "#ED1C24" : totalPct === 100 ? "#4a7c59" : "#0000FF",
                    transition: "width 0.25s, background-color 0.2s",
                  }}
                />
              </Box>
              {remaining > 0 && (
                <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.67rem", xxl: "0.75rem", xxxl: "0.9rem" }, color: "#aaa", mt: "0.25rem", lineHeight: 1.45 }}>
                  {remaining.toFixed(1)}% {tStr(t, "calc.customMix.remaining", "remaining to allocate")}
                </Typography>
              )}
            </Box>

            {/* Per-type sliders */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {WASTE_TYPES.map((wt) => {
                const pct = draft.composition[wt.key] ?? 0;
                return (
                  <Box
                    key={wt.key}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "18px minmax(0, 1fr) minmax(0, 1.15fr) 56px",
                        sm: "28px 90px 1fr 58px",
                        xxl: "32px 110px 1fr 68px",
                        xxxl: "36px 130px 1fr 78px",
                      },
                      gap: { xs: "0.35rem", sm: "0.5rem", xxl: "0.7rem" },
                      alignItems: "center",
                    }}
                  >
                    {/* Color swatch */}
                    <Box sx={{ width: 10, height: 10, bgcolor: wt.color, borderRadius: "50%", mx: "auto" }} />
                    {/* Label */}
                    <Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.76rem", xxl: "0.86rem", xxxl: "1rem" }, fontWeight: 600, color: "#333", whiteSpace: { xs: "normal", sm: "nowrap" }, overflow: "hidden", textOverflow: { xs: "clip", sm: "ellipsis" }, overflowWrap: "anywhere", lineHeight: 1.2, minWidth: 0 }}>
                      {tStr(t, wt.key, wt.key)}
                    </Typography>
                    {/* Slider */}
                    <Slider
                      size="small"
                      value={pct}
                      min={0}
                      max={100}
                      step={0.5}
                      onChange={(_, v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        setCompositionKey(wt.key, String(val));
                      }}
                      sx={{
                        color: wt.color,
                        py: "4px",
                        minWidth: 0,
                        "& .MuiSlider-thumb": { width: 12, height: 12, bgcolor: wt.color },
                        "& .MuiSlider-rail": { opacity: 0.15 },
                      }}
                    />
                    {/* Number input */}
                    <TextField
                      size="small"
                      value={pct === 0 ? "" : pct}
                      onChange={(e) => setCompositionKey(wt.key, e.target.value)}
                      placeholder="0"
                      inputProps={{ inputMode: "decimal", pattern: "[0-9.]*", maxLength: 6 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: "0.65rem", color: "#aaa" }}>%</Typography></InputAdornment>,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0,
                          "& fieldset": { borderColor: pct > 0 ? wt.color + "80" : "#ddd" },
                        },
                        minWidth: 0,
                        "& input": { textAlign: "center", fontWeight: 700, fontSize: "0.82rem", padding: "4px 2px" },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Moisture override */}
            <Box sx={{ mt: "1.25rem", pt: "1rem", borderTop: "1px solid #f0f0f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "0.4rem" }}>
                <Typography sx={{ fontSize: { xs: "0.66rem", md: "0.72rem", xxl: "0.8rem", xxxl: "0.95rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", pr: "0.75rem", lineHeight: 1.35 }}>
                  {tStr(t, "calc.customMix.moistureOverride", "Moisture override for this mix")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.72rem", md: "0.75rem", xxl: "0.84rem", xxxl: "1rem" }, fontWeight: 700, color: "#555", flexShrink: 0 }}>{draft.moisture}%</Typography>
              </Box>
              <Slider
                size="small"
                value={draft.moisture}
                min={0}
                max={60}
                step={0.5}
                onChange={(_, v) => setDraft((p) => ({ ...p, moisture: Array.isArray(v) ? v[0] : v }))}
                sx={{ color: "#555", "& .MuiSlider-thumb": { bgcolor: "#555" }, "& .MuiSlider-rail": { opacity: 0.15 } }}
              />
            </Box>
          </Box>

          {/* Right: donut chart + blended stats */}
          <Box
            sx={{
              p: "1.25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              bgcolor: "#fafafa",
              borderTop: { xs: "1px solid #eee", md: "none" },
            }}
          >
            <Typography sx={{ fontSize: { xs: "0.66rem", md: "0.7rem", xxl: "0.78rem", xxxl: "0.92rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#aaa", alignSelf: "flex-start" }}>
              {tStr(t, "calc.customMix.chartTitle", "Mix preview")}
            </Typography>
            <DonutChart segments={segments} size={150} />

            {/* Legend */}
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {WASTE_TYPES.filter((w) => (draft.composition[w.key] ?? 0) > 0).map((wt) => (
                <Box key={wt.key} sx={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: wt.color, borderRadius: "50%", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.68rem", xxl: "0.76rem", xxxl: "0.9rem" }, color: "#555", flex: 1, minWidth: 0, lineHeight: 1.35, overflowWrap: "anywhere" }}>{tStr(t, wt.key, wt.key)}</Typography>
                  <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.68rem", xxl: "0.76rem", xxxl: "0.9rem" }, fontWeight: 700, color: wt.color, flexShrink: 0 }}>{(draft.composition[wt.key] ?? 0).toFixed(1)}%</Typography>
                </Box>
              ))}
            </Box>

            {/* Blended stats */}
            {totalPct > 0 && (
              <Box sx={{ width: "100%", p: "0.7rem", bgcolor: "#fff", border: "1px solid #eee", borderLeft: "3px solid #555" }}>
                <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.67rem", xxl: "0.75rem", xxxl: "0.9rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#aaa", mb: "0.4rem" }}>
                  {tStr(t, "calc.customMix.blendedStats", "Blended properties")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.67rem", md: "0.71rem", xxl: "0.8rem", xxxl: "0.96rem" }, fontFamily: "monospace", color: "#333", lineHeight: 1.8 }}>
                  HHV_dry: <strong>{blendedHhv.toFixed(2)}</strong> MJ/kg<br />
                  NCV_ar @{draft.moisture}%: <strong style={{ color: "#555" }}>{blendedNcv.toFixed(2)}</strong> MJ/kg
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: "1.5rem", py: "1rem", borderTop: "1px solid #eee", display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", gap: { xs: "0.75rem", sm: "1rem" }, flexShrink: 0, bgcolor: "#fafafa" }}>
          <Box sx={{ minWidth: 0 }}>
            {totalPct < 99.5 && totalPct > 0 && (
              <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.72rem", xxl: "0.8rem", xxxl: "0.95rem" }, color: "#ED1C24", fontWeight: 600, lineHeight: 1.45, overflowWrap: "anywhere" }}>
                {tStr(t, "calc.customMix.mustReach100", "Composition must reach 100% to save")} ({totalPct.toFixed(1)}%)
              </Typography>
            )}
            {totalPct === 0 && (
              <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.72rem", xxl: "0.8rem", xxxl: "0.95rem" }, color: "#ccc", lineHeight: 1.45 }}>
                {tStr(t, "calc.customMix.startAdding", "Add waste types above to build your mix")}
              </Typography>
            )}
            {totalPct >= 99.5 && totalPct <= 100.5 && (
              <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.72rem", xxl: "0.8rem", xxxl: "0.95rem" }, color: "#4a7c59", fontWeight: 700, lineHeight: 1.45 }}>
                ✓ {tStr(t, "calc.customMix.readyToSave", "Ready to save")}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: { xs: "stretch", sm: "flex-end" } }}>
            <Button
              onClick={onClose}
              sx={{ color: "#888", fontWeight: 600, borderRadius: 0, px: "1rem", textTransform: "none", fontSize: { xs: "0.8rem", xxl: "0.9rem", xxxl: "1.05rem" }, "&:hover": { bgcolor: "#f5f5f5" } }}
            >
              {tStr(t, "common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={totalPct < 99.5 || totalPct > 100.5}
              sx={{
                bgcolor: totalPct >= 99.5 && totalPct <= 100.5 ? "#000" : "#ddd",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 0,
                px: "1.5rem",
                py: "0.5rem",
                fontSize: { xs: "0.82rem", xxl: "0.94rem", xxxl: "1.1rem" },
                textTransform: "none",
                "&:hover": { bgcolor: totalPct >= 99.5 ? "#0000FF" : "#ddd" },
                "&.Mui-disabled": { color: "#aaa" },
              }}
            >
              {tStr(t, "calc.customMix.saveButton", "Save Custom Mix")}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

// ─── PDF helpers ──────────────────────────────────────────────────────────────
const PDF_LOGO_URL = "/wpt logo-01.png";
const PDF_LOGO_WIDTH_PX = 1313;
const PDF_LOGO_HEIGHT_PX = 254;
let pdfFontDataPromise: Promise<Record<string, string>> | null = null;
let pdfLogoDataUrlPromise: Promise<string> | null = null;

function arrayBufferToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk)
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}
async function fetchB64(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed: ${url}`);
  return arrayBufferToBase64(await r.arrayBuffer());
}
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const blob = await r.blob();
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => res(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}
async function getPdfFontData() {
  if (!pdfFontDataPromise) {
    pdfFontDataPromise = Promise.all([
      fetchB64(figtreeRegularTtfUrl), fetchB64(figtreeSemiBoldTtfUrl),
      fetchB64(stackRegularTtfUrl), fetchB64(stackBoldTtfUrl),
    ]).then(([figtreeRegular, figtreeSemiBold, stackRegular, stackBold]) => ({
      figtreeRegular, figtreeSemiBold, stackRegular, stackBold,
    }));
  }
  return pdfFontDataPromise;
}
async function registerPdfFonts(doc: jsPDF) {
  const fonts = await getPdfFontData();
  doc.addFileToVFS("Figtree-Regular.ttf", fonts.figtreeRegular);
  doc.addFont("Figtree-Regular.ttf", "Figtree", "normal");
  doc.addFileToVFS("Figtree-SemiBold.ttf", fonts.figtreeSemiBold);
  doc.addFont("Figtree-SemiBold.ttf", "Figtree", "bold");
  doc.addFileToVFS("StackSansText-Regular.ttf", fonts.stackRegular);
  doc.addFont("StackSansText-Regular.ttf", "Stack Sans Headline", "normal");
  doc.addFileToVFS("StackSansText-Bold.ttf", fonts.stackBold);
  doc.addFont("StackSansText-Bold.ttf", "Stack Sans Headline", "bold");
}
async function getPdfLogoDataUrl() {
  if (!pdfLogoDataUrlPromise) {
    pdfLogoDataUrlPromise = (async () => {
      const r = await fetch(PDF_LOGO_URL);
      if (!r.ok) throw new Error("Logo failed");
      const blob = await r.blob();
      return new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onloadend = () => typeof reader.result === "string" ? res(reader.result) : rej(new Error("Conversion failed"));
        reader.onerror = () => rej(new Error("Read failed"));
        reader.readAsDataURL(blob);
      });
    })();
  }
  return pdfLogoDataUrlPromise;
}

// ─── WasteSelectorOverlay ─────────────────────────────────────────────────────
function WasteSelectorOverlay({
  open, onClose, activeKeys, onToggle, onOpenCustomBuilder, customTypes,
}: {
  open: boolean;
  onClose: () => void;
  activeKeys: Set<string>;
  onToggle: (key: string) => void;
  onOpenCustomBuilder: () => void;
  customTypes: WasteType[];
}) {
  const { t } = useTranslation();
  const allTypes = [...WASTE_TYPES, ...customTypes];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "fixed", inset: 0, zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(3px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", width: "min(100%, 92vw)", maxWidth: "min(96rem, 86vw)", maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: "1rem", sm: "1.5rem", xxl: "1.4vw", xxxl: "1.6vw" }, py: { xs: "0.9rem", sm: "1.1rem", xxl: "1vw", xxxl: "1.1vw" }, borderBottom: "2px solid #000", flexShrink: 0 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "1.1rem", sm: "1.3rem", xxl: "1.35vw", xxxl: "1.65vw" }, lineHeight: 1.05 }}>
                  {tStr(t, "calc.selector.title", "Select Waste Types")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.72rem", sm: "0.75rem", xxl: "0.82vw", xxxl: "1vw" }, color: "#888", mt: "0.25rem", lineHeight: 1.4 }}>
                  {tStr(t, "calc.selector.subtitle", "Click to add or remove from your mix")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: { xs: "0.4rem", xxl: "0.5vw", xxxl: "0.6vw" }, alignItems: "center" }}>
                {/* Custom mix button */}
                <Button
                  onClick={(e) => { e.stopPropagation(); onOpenCustomBuilder(); }}
                  startIcon={<FaLayerGroup size={12} />}
                  sx={{ bgcolor: "#0000FF", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "0.75rem", sm: "1rem", xxl: "0.95vw", xxxl: "1.1vw" }, py: { xs: "0.4rem", sm: "0.45rem", xxl: "0.42vw", xxxl: "0.5vw" }, fontSize: { xs: "0.68rem", sm: "0.78rem", xxl: "0.82vw", xxxl: "1vw" }, textTransform: "none", "&:hover": { bgcolor: "#0000cc" }, flexShrink: 0 }}
                >
                  {tStr(t, "calc.selector.createCustom", "Create Custom Mix")}
                </Button>
                <IconButton onClick={onClose} size="small" sx={{ border: "2px solid #000", borderRadius: 0, p: { xs: "0.25rem", sm: "0.3rem", xxl: "0.3vw", xxxl: "0.35vw" } }}>
                  <FaTimes size={14} />
                </IconButton>
              </Box>
            </Box>

            {/* Grid */}
            <Box sx={{ overflowY: "auto", p: { xs: "0.85rem", sm: "1.25rem", xxl: "1.15vw", xxxl: "1.35vw" }, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: { xs: "0.55rem", sm: "0.75rem", xxl: "0.8vw", xxxl: "0.95vw" } }}>
              {allTypes.map((wt) => {
                const isSelected = activeKeys.has(wt.key);
                const label = getWasteLabel(t, wt);
                return (
                  <Box
                    key={wt.key}
                    onClick={() => onToggle(wt.key)}
                    sx={{
                      position: "relative", cursor: "pointer",
                      border: isSelected ? `2px solid ${wt.color}` : "2px solid #e8e8e8",
                      bgcolor: isSelected ? `${wt.color}10` : "#fafafa",
                      transition: "all 0.15s",
                      "&:hover": { border: `2px solid ${wt.color}`, bgcolor: `${wt.color}08` },
                    }}
                  >
                    <Box sx={{ position: "relative", height: { xs: "4.75rem", sm: "5.5rem", xxl: "6.2vw", xxxl: "7vw" }, overflow: "hidden", bgcolor: "#111" }}>
                      <Box
                        component="img" src={wt.image} alt={label}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: isSelected ? 1 : 0.6, transition: "opacity 0.15s" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", bgcolor: wt.color }} />
                      {wt.isCustom && (
                        <Box sx={{ position: "absolute", top: "0.3rem", left: "0.3rem", bgcolor: "#0000FF", px: { xs: "0.25rem", xxl: "0.3vw", xxxl: "0.36vw" }, py: { xs: "0.08rem", xxl: "0.1vw", xxxl: "0.12vw" } }}>
                          <Typography sx={{ fontSize: { xs: "0.48rem", sm: "0.55rem", xxl: "0.56vw", xxxl: "0.68vw" }, color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {tStr(t, "calc.customMix.badge", "Custom")}
                          </Typography>
                        </Box>
                      )}
                      {isSelected && (
                        <Box sx={{ position: "absolute", top: "0.3rem", right: "0.3rem", width: { xs: 18, sm: 20, xxl: "1.35vw", xxxl: "1.6vw" }, height: { xs: 18, sm: 20, xxl: "1.35vw", xxxl: "1.6vw" }, bgcolor: wt.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaCheck size={10} color="#fff" />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ px: { xs: "0.45rem", sm: "0.55rem", xxl: "0.5vw", xxxl: "0.6vw" }, py: { xs: "0.45rem", sm: "0.5rem", xxl: "0.45vw", xxxl: "0.55vw" } }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.66rem", sm: "0.75rem", xxl: "0.82vw", xxxl: "1vw" }, lineHeight: 1.2, mb: "0.1rem", overflowWrap: "anywhere" }}>{label}</Typography>
                      <Typography sx={{ fontSize: { xs: "0.56rem", sm: "0.62rem", xxl: "0.66vw", xxxl: "0.8vw" }, color: "#aaa", fontFamily: "monospace" }}>
                        {wt.hhvDry.toFixed(1)} MJ/kg dry
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Footer */}
            <Box sx={{ px: { xs: "1rem", sm: "1.5rem", xxl: "1.4vw", xxxl: "1.6vw" }, py: { xs: "0.8rem", sm: "1rem", xxl: "0.9vw", xxxl: "1vw" }, borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, bgcolor: "#fafafa" }}>
              <Typography sx={{ fontSize: { xs: "0.72rem", sm: "0.78rem", xxl: "0.84vw", xxxl: "1vw" }, color: "#888" }}>
                {activeKeys.size} {tStr(t, "calc.selector.typesSelected", "type(s) selected")}
              </Typography>
              <Button
                onClick={onClose}
                sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "1rem", sm: "1.5rem", xxl: "1.2vw", xxxl: "1.4vw" }, py: { xs: "0.45rem", sm: "0.5rem", xxl: "0.42vw", xxxl: "0.5vw" }, fontSize: { xs: "0.78rem", sm: "0.85rem", xxl: "0.88vw", xxxl: "1.05vw" }, textTransform: "none", "&:hover": { bgcolor: "#0000FF" } }}
              >
                {tStr(t, "calc.selector.confirm", "Confirm selection")}
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FloatInput ───────────────────────────────────────────────────────────────
function FloatInput({
  value, onChange, unit, min = 0, max = 99999, placeholder = "0", step = 0.5,
  sx = {},
}: {
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min?: number;
  max?: number;
  placeholder?: string;
  step?: number;
  sx?: object;
}) {
  const [localVal, setLocalVal] = useState(value === 0 ? "" : String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const n = clampFloat(raw, min, max);
    setLocalVal(n === 0 ? "" : String(n));
    onChange(n);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.35rem", ...sx }}>
      <IconButton size="small" onClick={() => { const n = Math.max(min, parseFloat(((value || 0) - step).toFixed(2))); setLocalVal(n === 0 ? "" : String(n)); onChange(n); }}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 0, p: "2px", flexShrink: 0 }}>
        <FaMinus size={8} />
      </IconButton>
      <TextField
        size="small"
        inputRef={inputRef}
        value={localVal}
        onChange={(e) => {
          const safe = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 10);
          setLocalVal(safe);
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }}
        placeholder={placeholder}
        inputProps={{ inputMode: "decimal", pattern: "[0-9.]*", maxLength: 10 }}
        InputProps={{
          endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: "0.65rem", color: "#aaa", whiteSpace: "nowrap" }}>{unit}</Typography></InputAdornment>,
        }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
          "& input": { textAlign: "center", fontWeight: 700, fontSize: "0.85rem", p: "4px 0" },
        }}
      />
      <IconButton size="small" onClick={() => { const n = Math.min(max, parseFloat(((value || 0) + step).toFixed(2))); setLocalVal(String(n)); onChange(n); }}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 0, p: "2px", flexShrink: 0 }}>
        <FaPlus size={8} />
      </IconButton>
    </Box>
  );
}

// ─── ActiveWasteRow ───────────────────────────────────────────────────────────
function ActiveWasteRow({
  wasteType, tonnes, moisture, ncvArVal, onTonnesChange, onMoistureChange, onRemove, onInfoClick,
}: {
  wasteType: WasteType; tonnes: number; moisture: number; ncvArVal: number;
  onTonnesChange: (v: number) => void; onMoistureChange: (v: number) => void;
  onRemove: () => void; onInfoClick: () => void;
}) {
  const { t } = useTranslation();
  const label = getWasteLabel(t, wasteType);

  return (
    <motion.div layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "auto 1fr", sm: "auto 1fr auto" }, gap: { xs: "0.65rem", sm: "0.85rem" }, alignItems: "center", p: "0.7rem", border: `1px solid ${wasteType.color}28`, bgcolor: `${wasteType.color}04`, mb: "0.45rem", borderLeft: `3px solid ${wasteType.color}` }}>
        {/* Thumbnail */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.55rem", cursor: "pointer" }} onClick={onInfoClick}>
          <Box sx={{ width: { xs: 38, xl: 44 }, height: { xs: 38, xl: 44 }, flexShrink: 0, overflow: "hidden", bgcolor: "#111", position: "relative", "&:hover .tov": { opacity: 1 } }}>
            <Box component="img" src={wasteType.image} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <Box className="tov" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.15s" }}>
              <FaInfoCircle size={12} color="#fff" />
            </Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", lineHeight: 1.2, color: "#1a1a1a" }}>{label}</Typography>
            <Typography sx={{ fontSize: "0.63rem", fontFamily: "monospace", color: ncvArVal > 0 ? wasteType.color : "#ccc", fontWeight: 600 }}>
              NCV_ar {ncvArVal.toFixed(2)} MJ/kg
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <FloatInput value={tonnes} onChange={onTonnesChange} unit={tStr(t, "unit.th", "t/h")} min={0} max={9999} step={0.5} />
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Typography sx={{ fontSize: "0.63rem", color: "#ccc", flexShrink: 0 }}>{tStr(t, "calc.row.moisture", "Moisture")}:</Typography>
            <Slider size="small" value={moisture} min={0} max={60} step={0.5}
              onChange={(_, v) => onMoistureChange(Array.isArray(v) ? v[0] : v)}
              sx={{ flex: 1, color: wasteType.color, py: "3px", "& .MuiSlider-thumb": { width: 10, height: 10, bgcolor: wasteType.color }, "& .MuiSlider-rail": { opacity: 0.15 } }}
            />
            <Typography sx={{ fontSize: "0.67rem", fontWeight: 600, color: "#555", minWidth: "2rem", textAlign: "right", flexShrink: 0 }}>{moisture.toFixed(1)}%</Typography>
          </Box>
        </Box>

        {/* Remove */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <IconButton size="small" onClick={onRemove} sx={{ border: "1px solid #e8e8e8", borderRadius: 0, p: "4px", color: "#ccc", "&:hover": { border: "1px solid #ED1C24", color: "#ED1C24", bgcolor: "#fff0f0" } }}>
            <FaTimes size={10} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "flex-end", mb: "0.4rem", mt: "-0.2rem" }}>
        <Button size="small" onClick={onRemove} sx={{ fontSize: "0.63rem", color: "#ccc", textTransform: "none", p: "0.1rem 0.4rem", minWidth: 0, "&:hover": { color: "#ED1C24" } }} startIcon={<FaTimes size={8} />}>
          {tStr(t, "common.remove", "Remove")}
        </Button>
      </Box>
    </motion.div>
  );
}

// ─── ImpactCard ───────────────────────────────────────────────────────────────
type ImpactCardProps = { value: string; label: string; sub: string; color: string; icon: IconType; highlight?: boolean };
function ImpactCard({ value, label, sub, color, icon: Icon, highlight }: ImpactCardProps) {
  return (
    <Box sx={{ p: { xs: "0.85rem", xl: "1rem" }, bgcolor: color, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: { xs: "7.5rem", xl: "9.5rem" }, outline: highlight ? "2px solid #0000FF" : "none", outlineOffset: 2 }}>
      <Box sx={{ mb: "0.4rem" }}><Icon size={17} /></Box>
      <Typography sx={{ fontSize: { xs: "1.2rem", xl: "1.55rem" }, fontWeight: 800, lineHeight: 1, mb: "0.25rem" }}>{value}</Typography>
      <Typography sx={{ fontSize: { xs: "0.62rem", xl: "0.75rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: "0.2rem" }}>{label}</Typography>
      <Typography sx={{ fontSize: { xs: "0.58rem", xl: "0.68rem" }, opacity: 0.75 }}>{sub}</Typography>
    </Box>
  );
}

// ─── Waste Info Dialog ────────────────────────────────────────────────────────
function WasteInfoDialog({ wasteType, open, onClose }: { wasteType: WasteType | null; open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  if (!wasteType) return null;
  const ncvDefault = ncvAr(wasteType.hhvDry, wasteType.defaultMoisture);
  const label = getWasteLabel(t, wasteType);
  const description = tStr(t, `${wasteType.key}-description`, "");
  const typicalSources = getWasteTypicalSources(t, wasteType);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 0, border: `3px solid ${wasteType.color}` } }}>
      <DialogTitle sx={{ p: 0, position: "relative" }}>
        <Box sx={{ height: 170, overflow: "hidden", position: "relative", bgcolor: "#111" }}>
          <Box component="img" src={wasteType.image} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />
          <Box sx={{ position: "absolute", bottom: "1rem", left: "1.5rem", right: "3.5rem" }}>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}>{label}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.73rem", mt: "0.2rem" }}>HHV dry: {wasteType.hhvDry.toFixed(1)} MJ/kg</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: "0.6rem", right: "0.6rem", bgcolor: "rgba(0,0,0,0.45)", "&:hover": { bgcolor: "rgba(0,0,0,0.65)" } }}>
          <FaTimes color="#fff" size={12} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: "1.25rem" }}>
        {description && <Typography sx={{ fontSize: "0.84rem", color: "#444", lineHeight: 1.7, mb: "1rem" }}>{description}</Typography>}
        <Box sx={{ mb: "0.9rem" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", mb: "0.4rem", color: "#999" }}>{tStr(t, "calc.info.characteristics", "Key Characteristics")}</Typography>
          {wasteType.characteristics.map((c) => (
            <Box key={c} sx={{ display: "flex", alignItems: "center", gap: "0.4rem", mb: "0.2rem" }}>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: wasteType.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.77rem", color: "#555" }}>{c}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mb: "1rem" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", mb: "0.35rem", color: "#999" }}>{tStr(t, "calc.info.sources", "Typical Sources")}</Typography>
          <Typography sx={{ fontSize: "0.77rem", color: "#555", lineHeight: 1.6 }}>{typicalSources}</Typography>
        </Box>
        <Box sx={{ p: "0.8rem", bgcolor: "#f7f7f7", borderLeft: `4px solid ${wasteType.color}` }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em", mb: "0.4rem", color: "#777" }}>EN 14918 / ISO 1928</Typography>
          <Typography sx={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#333", lineHeight: 2 }}>
            NCV_ar = HHV_dry × (1 − M/100) − 2.443 × (M/100)<br />
            @ {wasteType.defaultMoisture}%: = {wasteType.hhvDry.toFixed(1)} × {(1 - wasteType.defaultMoisture / 100).toFixed(2)} − 2.443 × {(wasteType.defaultMoisture / 100).toFixed(2)}<br />
            <strong style={{ color: wasteType.color }}>= {ncvDefault.toFixed(2)} MJ/kg as-received</strong>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImpactCalculatorAdvanced() {
  const { t, i18n } = useTranslation();

  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [customTypes, setCustomTypes] = useState<WasteType[]>([]);
  const [wasteInputs, setWasteInputs] = useState<Record<string, { tonnes: number; moisture: number }>>(
    Object.fromEntries(WASTE_TYPES.map((w) => [w.key, { tonnes: 0, moisture: w.defaultMoisture }]))
  );

  // Total amount mode
  const [totalAmountMode, setTotalAmountMode] = useState(false);
  const [totalAmountUnit, setTotalAmountUnit] = useState<"t" | "kg">("t");
  const [totalAmountValue, setTotalAmountValue] = useState(0);

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [customBuilderOpen, setCustomBuilderOpen] = useState(false);
  const [dialogWaste, setDialogWaste] = useState<WasteType | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const allTypes = useMemo(() => [...WASTE_TYPES, ...customTypes], [customTypes]);

  const toggleWasteKey = useCallback((key: string) => {
    setActiveKeys((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }, []);

  const removeWasteKey = useCallback((key: string) => {
    setActiveKeys((prev) => prev.filter((k) => k !== key));
    setWasteInputs((prev) => ({ ...prev, [key]: { ...prev[key], tonnes: 0 } }));
  }, []);

  const saveCustomMix = useCallback((mix: WasteType) => {
    setCustomTypes((prev) => [...prev, mix]);
    setWasteInputs((prev) => ({ ...prev, [mix.key]: { tonnes: 0, moisture: mix.defaultMoisture } }));
    setCustomBuilderOpen(false);
  }, []);

  // ── Core calculations ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const { annualHours, mwhPerHousehold, co2PerTonneAvoided, treesPerTonneCO2, co2PerCarYear, generatorEfficiency, MJ_PER_MWH } = CONSTANTS;

    let totalTonnesPerHour = 0;
    let totalEnergyMJPerHour = 0;
    const breakdown: { label: string; key: string; tonnes: number; moisture: number; ncvArVal: number; energyMJ: number; image: string }[] = [];

    activeKeys.forEach((key) => {
      const wt = allTypes.find((w) => w.key === key);
      if (!wt) return;
      const { tonnes, moisture } = wasteInputs[key] ?? { tonnes: 0, moisture: wt.defaultMoisture };
      if (tonnes <= 0) return;
      const ncvArVal = ncvAr(wt.hhvDry, moisture);
      const energyMJ = tonnes * 1000 * ncvArVal; // tonnes/h × 1000 kg/t × MJ/kg = MJ/h
      totalTonnesPerHour += tonnes;
      totalEnergyMJPerHour += energyMJ;
      breakdown.push({ label: getWasteLabel(t, wt), key, tonnes, moisture, ncvArVal, energyMJ, image: wt.image });
    });

    // MWh_electric/h = (totalEnergyMJ/h / 3600 MJ/MWh) × η
    const mwhElectricPerHour = (totalEnergyMJPerHour / MJ_PER_MWH) * generatorEfficiency;

    // Annual / Monthly / Daily
    const annualMWh = Math.round(mwhElectricPerHour * annualHours);
    const monthlyMWh = Math.round(annualMWh / 12);
    const dailyMWh = Math.round(annualMWh / 365);

    const annualTons = Math.round(totalTonnesPerHour * annualHours);
    const co2Annual = Math.round(annualTons * co2PerTonneAvoided);
    const householdsAnnual = Math.floor(annualMWh / mwhPerHousehold);
    const treesAnnual = Math.floor(co2Annual * treesPerTonneCO2);
    const carsAnnual = Math.floor(co2Annual / co2PerCarYear);

    // Total amount mode — hours to process
    let hoursToProcess: number | null = null;
    if (totalAmountMode && totalAmountValue > 0 && totalTonnesPerHour > 0) {
      const totalTonnes = totalAmountUnit === "t" ? totalAmountValue : totalAmountValue / 1000;
      hoursToProcess = totalTonnes / totalTonnesPerHour;
    }

    return {
      totalTonnesPerHour,
      totalEnergyMJPerHour: Math.round(totalEnergyMJPerHour),
      mwhElectricPerHour: mwhElectricPerHour.toFixed(3),
      annualMWh,
      monthlyMWh,
      dailyMWh,
      annualMWhStr: annualMWh.toLocaleString("en-US"),
      monthlyMWhStr: monthlyMWh.toLocaleString("en-US"),
      dailyMWhStr: dailyMWh.toLocaleString("en-US"),
      annualTons,
      annualTonsStr: annualTons.toLocaleString("en-US"),
      co2Annual,
      co2AnnualStr: co2Annual.toLocaleString("en-US"),
      householdsAnnualStr: householdsAnnual.toLocaleString("en-US"),
      treesAnnualStr: treesAnnual.toLocaleString("en-US"),
      carsAnnualStr: carsAnnual.toLocaleString("en-US"),
      hoursToProcess,
      breakdown,
      hasInput: totalTonnesPerHour > 0,
      annualHours,
    };
  }, [activeKeys, wasteInputs, allTypes, t, i18n.language, totalAmountMode, totalAmountValue, totalAmountUnit]);

  const ncvArMap = useMemo(() => {
    const map: Record<string, number> = {};
    allTypes.forEach((wt) => {
      const moisture = wasteInputs[wt.key]?.moisture ?? wt.defaultMoisture;
      map[wt.key] = ncvAr(wt.hhvDry, moisture);
    });
    return map;
  }, [wasteInputs, allTypes]);

  // ── Metric cards ─────────────────────────────────────────────────────────
  const metrics: ImpactCardProps[] = [
    { value: stats.annualMWhStr, label: tStr(t, "calc.metric.mwhYear", "MWh / Year"), sub: tStr(t, "calc.metric.electricalOutput", "Electrical output"), color: BRAND.power, icon: FaBolt },
    { value: stats.monthlyMWhStr, label: tStr(t, "calc.metric.mwhMonth", "MWh / Month"), sub: tStr(t, "calc.metric.avgMonthly", "Average monthly"), color: BRAND.power, icon: FaBolt },
    { value: stats.dailyMWhStr, label: tStr(t, "calc.metric.mwhDay", "MWh / Day"), sub: tStr(t, "calc.metric.avgDaily", "Average daily"), color: BRAND.power, icon: FaBolt },
    { value: stats.householdsAnnualStr, label: tStr(t, "calc.metric.households", "Households"), sub: tStr(t, "calc.metric.householdsSub", "EU avg 3.6 MWh/yr"), color: BRAND.waste, icon: FaIndustry },
    { value: `${stats.co2AnnualStr} t`, label: tStr(t, "calc.metric.co2Avoided", "CO₂ Avoided"), sub: tStr(t, "calc.metric.co2Sub", "Landfill methane offset"), color: BRAND.waste, icon: FaLeaf },
    { value: stats.treesAnnualStr, label: tStr(t, "calc.metric.trees", "Trees Equiv."), sub: tStr(t, "calc.metric.treesSub", "CO₂ sequestration"), color: BRAND.waste, icon: FaTree },
    { value: stats.carsAnnualStr, label: tStr(t, "calc.metric.cars", "Cars Off Road"), sub: tStr(t, "calc.metric.carsSub", "Annual equiv. EEA 2023"), color: BRAND.waste, icon: FaCarSide },
    { value: `${CONSTANTS.uptimePct}%`, label: tStr(t, "calc.metric.uptime", "System Uptime"), sub: `${stats.annualHours} h/yr`, color: BRAND.tech, icon: FaServer },
    { value: "24/7", label: tStr(t, "calc.metric.grid", "Grid Response"), sub: tStr(t, "calc.metric.gridSub", "Continuous load support"), color: BRAND.tech, icon: FaChartLine },
  ];

  // Hours-to-process card
  const hoursCard: ImpactCardProps | null = totalAmountMode && stats.hoursToProcess !== null ? {
    value: stats.hoursToProcess < 1 ? `${Math.round(stats.hoursToProcess * 60)} min` : `${stats.hoursToProcess.toFixed(1)} h`,
    label: tStr(t, "calc.metric.processingTime", "Processing Time"),
    sub: tStr(t, "calc.metric.processingTimeSub", "To process total amount"),
    color: "#1a1a1a",
    icon: FaClock,
    highlight: true,
  } : null;

  // ── PDF Export ─────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [297, 560] });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 18;
    let y = 0;
    let titleFont = "helvetica";
    let bodyFont = "helvetica";

    try { await registerPdfFonts(doc); titleFont = "Stack Sans Headline"; bodyFont = "Figtree"; }
    catch (e) { console.error("Font load failed", e); }

    // Header
    try {
      const logoDataUrl = await getPdfLogoDataUrl();
      const logoH = 9;
      const logoW = (logoH * PDF_LOGO_WIDTH_PX) / PDF_LOGO_HEIGHT_PX;
      doc.addImage(logoDataUrl, "PNG", margin, 12, logoW, logoH);
    } catch {
      doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.setFont(titleFont, "bold");
      doc.text("WASTE POWERTECH SRL", margin, 20);
    }

    y = 30;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.6);
    doc.line(margin, y, pageW - margin, y);
    y += 10;
    doc.setTextColor(0, 0, 0); doc.setFontSize(16); doc.setFont(titleFont, "bold");
    doc.text("Environmental Impact Estimate Report", pageW / 2, y, { align: "center" });
    y += 7;
    doc.setFontSize(8.5); doc.setFont(bodyFont, "normal"); doc.setTextColor(90, 90, 90);
    doc.text(`WP1000 · Mix: ${stats.totalTonnesPerHour.toFixed(2)} t/h · Date: ${new Date().toLocaleDateString("en-GB")}`, pageW / 2, y, { align: "center" });
    y += 5;
    doc.setFontSize(7.5); doc.setTextColor(150, 150, 150);
    doc.text("Estimates based on the Cluj – CMID project reference installation.", pageW / 2, y, { align: "center" });
    y += 7;
    doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);

    // Waste mix table with image thumbnails
    y += 8;
    doc.setFontSize(11.5); doc.setFont(titleFont, "bold"); doc.setTextColor(0, 0, 0);
    doc.text("Waste Mix Input", margin, y);
    y += 6;

    const imgColW = 14;
    const remainW = pageW - margin * 2 - imgColW - 2;
    const cW = remainW / 5;

    doc.setFontSize(7.5); doc.setFont(bodyFont, "bold"); doc.setTextColor(120, 120, 120);
    doc.text("", margin, y); // img col header
    ["Waste Type", "t/h", "HHV_dry", "NCV_ar", "Energy (GJ/h)"].forEach((h, i) =>
      doc.text(h, margin + imgColW + 2 + i * cW, y)
    );
    y += 4;
    doc.setDrawColor(200, 200, 200); doc.line(margin, y, pageW - margin, y);
    y += 5;

    if (stats.breakdown.length === 0) {
      doc.setFont(bodyFont, "normal"); doc.setTextColor(160, 160, 160);
      doc.text("No waste inputs configured.", margin, y); y += 7;
    } else {
      const imgPromises = stats.breakdown.map((row) => fetchImageAsDataUrl(row.image));
      const imgDataUrls = await Promise.all(imgPromises);

      doc.setFontSize(8.2);
      stats.breakdown.forEach((row, i) => {
        const wt = allTypes.find((w) => w.key === row.key)!;
        const rowH = 10;
        if (i % 2 === 0) { doc.setFillColor(248, 248, 248); doc.rect(margin - 2, y - 5, pageW - margin * 2 + 4, rowH, "F"); }

        // Image thumbnail
        const imgUrl = imgDataUrls[i];
        if (imgUrl) {
          try { doc.addImage(imgUrl, "PNG", margin, y - 4.5, imgColW - 2, 9, undefined, "FAST"); }
          catch { doc.setFillColor(230, 230, 230); doc.rect(margin, y - 4.5, imgColW - 2, 9, "F"); }
        } else {
          doc.setFillColor(200, 200, 200); doc.rect(margin, y - 4.5, imgColW - 2, 9, "F");
        }

        doc.setFont(bodyFont, "normal"); doc.setTextColor(0, 0, 0);
        [row.label, row.tonnes.toFixed(2), `${wt.hhvDry.toFixed(1)} MJ/kg`, `${row.ncvArVal.toFixed(2)} MJ/kg`, (row.energyMJ / 1000).toFixed(3)].forEach((c, ci) =>
          doc.text(c, margin + imgColW + 2 + ci * cW, y)
        );
        y += rowH;
      });
    }

    // Total row
    y += 1;
    doc.setFillColor(0, 0, 0); doc.rect(margin - 2, y - 4.5, pageW - margin * 2 + 4, 8, "F");
    doc.setFont(bodyFont, "bold"); doc.setTextColor(255, 255, 255);
    doc.text("TOTAL", margin + imgColW + 2, y);
    doc.text(stats.totalTonnesPerHour.toFixed(2), margin + imgColW + 2 + cW, y);
    doc.text("—", margin + imgColW + 2 + 2 * cW, y);
    doc.text("—", margin + imgColW + 2 + 3 * cW, y);
    doc.text((stats.totalEnergyMJPerHour / 1000).toFixed(3), margin + imgColW + 2 + 4 * cW, y);
    y += 10;

    // Results
    doc.setDrawColor(200, 200, 200); doc.line(margin, y, pageW - margin, y); y += 7;
    doc.setFontSize(11.5); doc.setFont(titleFont, "bold"); doc.setTextColor(0, 0, 0);
    doc.text("Annual Impact Results (WP1000)", margin, y); y += 6;

    type Row = [string, string, string];
    const results: Row[] = [
      ["Electrical output (per hr)", `${stats.mwhElectricPerHour} MWh/hr`, "η = 21.18% (WP1000 calibration)"],
      ["Annual energy generated", `${stats.annualMWhStr} MWh`, `${stats.annualHours} h/yr operating`],
      ["Monthly energy generated", `${stats.monthlyMWhStr} MWh`, "Annual ÷ 12"],
      ["Daily energy generated", `${stats.dailyMWhStr} MWh`, "Annual ÷ 365"],
      ["EU households powered", stats.householdsAnnualStr, "EU avg 3.6 MWh/yr — Eurostat 2023"],
      ["CO2 avoided (annual)", `${stats.co2AnnualStr} t CO2eq`, "0.30 t/tonne MSW — IPCC Tier II"],
      ["Equivalent trees", stats.treesAnnualStr, "45 trees/t CO2 — EPA 2024"],
      ["Cars removed from roads", stats.carsAnnualStr, "1.28 t CO2/car/yr — EEA 2023"],
      ["Waste processed (annual)", `${stats.annualTonsStr} t`, ""],
      ["System uptime", `${CONSTANTS.uptimePct}%`, `${stats.annualHours} h/yr`],
    ];
    if (stats.hoursToProcess !== null) {
      const label = totalAmountUnit === "t" ? `${totalAmountValue} t total` : `${totalAmountValue} kg total`;
      results.push(["Processing time", `${stats.hoursToProcess.toFixed(2)} h`, `For ${label} at ${stats.totalTonnesPerHour.toFixed(2)} t/h`]);
    }

    doc.setFontSize(8.8);
    results.forEach(([k, v, note], i) => {
      const rowH = note ? 11 : 7;
      if (i % 2 === 0) { doc.setFillColor(244, 244, 244); doc.rect(margin - 2, y - 4.5, pageW - margin * 2 + 4, rowH, "F"); }
      doc.setFont(bodyFont, "bold"); doc.setTextColor(50, 50, 50);
      doc.text(`${k}:`, margin, y);
      doc.setFont(bodyFont, "bold"); doc.setTextColor(0, 0, 200);
      doc.text(v, pageW - margin, y, { align: "right" });
      if (note) { y += 4.5; doc.setFont(bodyFont, "normal"); doc.setFontSize(7.2); doc.setTextColor(155, 155, 155); doc.text(note, margin + 2, y); doc.setFontSize(8.8); }
      y += 7.5;
    });

    // Sources
    y += 2; doc.setDrawColor(200, 200, 200); doc.line(margin, y, pageW - margin, y); y += 6;
    doc.setFontSize(10.5); doc.setFont(titleFont, "bold"); doc.setTextColor(0, 0, 0);
    doc.text("Methodology & Sources", margin, y); y += 5;
    const sources = [
      "MOISTURE: EN 14918/ISO 1928 — NCV_ar = HHV_dry×(1−M/100) − 2.443×(M/100). Mass dilution + evaporation energy. Non-linear penalty.",
      "ENERGY: MWh_electric = (Σ kg × NCV_ar [MJ/kg]) / 3600 [MJ/MWh] × η. η = 21.18% (WP1000 ref: 1 t/h biomass HHV 17 MJ/kg → 1 MWh).",
      "HHV_DRY (MJ/kg): Biomass 17, Hydrocarbons 42, Plastic 38, Textiles 18, Elastomers 38, Cellulosics 16, Carbon Resources 28.",
      "UPTIME: 24×(365−10)=8,520 h/yr (Cluj-CMID: 25,550 t/yr ÷ 2×1.5 t/h ÷ 24h = 354.9 d).",
      "HOUSEHOLDS 3.6 MWh/yr (Eurostat 2023) · CO2 0.30 t/tonne MSW (IPCC Tier II) · CARS 1.28 t CO2/yr (EEA 2023) · TREES 45/t CO2 (EPA 2024).",
    ];
    doc.setFont(bodyFont, "normal"); doc.setFontSize(7.5); doc.setTextColor(80, 80, 80);
    sources.forEach((s) => { const lines = doc.splitTextToSize(`• ${s}`, pageW - margin * 2); doc.text(lines, margin, y); y += lines.length * 4.2 + 1.5; });

    // Disclaimer
    y += 2; doc.setDrawColor(200, 200, 200); doc.line(margin, y, pageW - margin, y); y += 6;
    doc.setFontSize(10.5); doc.setFont(titleFont, "bold"); doc.setTextColor(180, 0, 0);
    doc.text("Disclaimer", margin, y); y += 5;
    doc.setFont(bodyFont, "normal"); doc.setFontSize(7.5); doc.setTextColor(110, 110, 110);
    const dis = doc.splitTextToSize("All figures are approximate estimates. Calorific values are literature-sourced midpoints. Actual output depends on waste composition, particle size, ash content, and operating conditions. This document does not constitute a binding commercial proposal. Waste Powertech SRL · wpowertech.ro", pageW - margin * 2);
    doc.text(dis, margin, y);

    // Footer
    doc.setFillColor(0, 0, 0); doc.rect(0, pageH - 13, pageW, 13, "F");
    doc.setFontSize(7.5); doc.setFont(bodyFont, "normal"); doc.setTextColor(200, 200, 200);
    doc.text("Waste Powertech SRL  ·  wpowertech.ro", pageW / 2, pageH - 4.5, { align: "center" });

    doc.save(`WPT-Impact-WasteMix-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <WasteSelectorOverlay
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        activeKeys={new Set(activeKeys)}
        onToggle={toggleWasteKey}
        onOpenCustomBuilder={() => { setSelectorOpen(false); setCustomBuilderOpen(true); }}
        customTypes={customTypes}
      />
      <AnimatePresence>
        {customBuilderOpen && (
          <CustomMixBuilder
            open={customBuilderOpen}
            onClose={() => setCustomBuilderOpen(false)}
            onSave={saveCustomMix}
          />
        )}
      </AnimatePresence>
      <WasteInfoDialog wasteType={dialogWaste} open={!!dialogWaste} onClose={() => setDialogWaste(null)} />

      <motion.div
        initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
      >
        <Box
          id="calculator"
          sx={{
            position: "relative", py: { xs: "4rem", xl: "8rem" }, bgcolor: "#f9f9f9",
            borderLeft: { xs: "0.4rem solid #0000FF", xl: "1.25rem solid #0000FF" },
            px: { xs: "1.25rem", xl: "4%", xxl: "4%", xxxl: "6%" },
            "&::before": { content: '""', position: "absolute", top: 0, left: { xs: "1.25rem", xl: "4%", xxl: "4%", xxxl: "6%" }, right: { xs: "1.25rem", xl: "4%", xxl: "4%", xxxl: "6%" }, borderTop: "0.2rem solid #000" },
          }}
        >
          <Container maxWidth={false}>

            {/* Page header */}
            <Box sx={{ mb: { xs: "2.5rem", xl: "4rem" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1.25rem", mb: "0.6rem", flexWrap: "wrap" }}>
                <Box component="img" src="/wpt-black-compact-logo.svg" alt="Waste Powertech logo" sx={{ width: { xs: "6.5rem", xl: "10rem" }, height: "auto" }} />
                <Typography variant="h2" sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.5rem", xl: "3.75rem", xxxl: "5rem" }, lineHeight: 1.1, mb: 0 }}>
                  {tStr(t, "calculator-title", "Impact Calculator")}
                </Typography>
              </Box>
              <Typography sx={{ color: "#999", fontSize: { xs: "0.82rem", xl: "0.95rem" }, maxWidth: "55ch" }}>
                {tStr(t, "calc.subtitle", "Build your waste mix — each type uses the")}{" "}
                <strong style={{ color: "#333" }}>EN 14918</strong>{" "}
                {tStr(t, "calc.subtitle2", "moisture correction formula for real energy yield.")}
              </Typography>
            </Box>

            {/* Main 2-column grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "5fr 7fr" }, gap: { xs: "2.5rem", xl: "4rem" }, alignItems: "flex-start" }}>

              {/* ════ LEFT COLUMN ════ */}
              <Box>
                {/* Add Waste button */}
                <Box sx={{ mb: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Button
                    onClick={() => setSelectorOpen(true)}
                    startIcon={<FaPlus size={12} />}
                    sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, borderRadius: 0, px: "1.4rem", py: "0.65rem", fontSize: { xs: "0.85rem", xl: "0.95rem" }, textTransform: "none", "&:hover": { bgcolor: "#0000FF" }, transition: "background-color 0.15s" }}
                  >
                    {tStr(t, "calc.addWaste", "Choose Waste Types")}
                  </Button>
                  {activeKeys.length > 0 && (
                    <Typography sx={{ fontSize: "0.75rem", color: "#aaa" }}>
                      {activeKeys.length} {tStr(t, "calc.typesSelected", "type(s) selected")}
                    </Typography>
                  )}
                </Box>

                {/* Active waste rows */}
                {activeKeys.length === 0 ? (
                  <Box sx={{ p: "2rem 1.5rem", border: "2px dashed #ddd", bgcolor: "#fff", textAlign: "center", mb: "1.25rem" }}>
                    <Typography sx={{ color: "#ccc", fontSize: "0.85rem", mb: "0.4rem" }}>{tStr(t, "calc.emptyTitle", "No waste types selected yet")}</Typography>
                    <Typography sx={{ color: "#ddd", fontSize: "0.75rem" }}>{tStr(t, "calc.emptyHint", "Click \"Choose Waste Types\" to begin")}</Typography>
                  </Box>
                ) : (
                  <Box sx={{ mb: "1.25rem" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#bbb", mb: "0.55rem" }}>
                      {tStr(t, "calc.mixLabel", "Waste mix — throughput & moisture")}
                    </Typography>
                    <AnimatePresence mode="popLayout">
                      {activeKeys.map((key) => {
                        const wt = allTypes.find((w) => w.key === key);
                        if (!wt) return null;
                        return (
                          <ActiveWasteRow
                            key={key}
                            wasteType={wt}
                            tonnes={wasteInputs[key]?.tonnes ?? 0}
                            moisture={wasteInputs[key]?.moisture ?? wt.defaultMoisture}
                            ncvArVal={ncvArMap[key] ?? 0}
                            onTonnesChange={(v) => setWasteInputs((prev) => ({ ...prev, [key]: { ...prev[key], tonnes: v } }))}
                            onMoistureChange={(v) => setWasteInputs((prev) => ({ ...prev, [key]: { ...prev[key], moisture: v } }))}
                            onRemove={() => removeWasteKey(key)}
                            onInfoClick={() => setDialogWaste(wt)}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </Box>
                )}

                {/* Mix summary strip */}
                {stats.hasInput && (
                  <Box sx={{ mb: "1.25rem", p: "1rem 1.25rem", bgcolor: "#000", color: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    {[
                      [tStr(t, "calc.summary.totalInput", "Total input"), `${stats.totalTonnesPerHour.toFixed(2)} ${tStr(t, "calc.summary.tph", "tonnes of waste/hour")}`],
                      [tStr(t, "calc.summary.thermal", "Thermal"), `${(stats.totalEnergyMJPerHour / 1000).toFixed(2)} GJ/h`],
                      [tStr(t, "calc.summary.electrical", "Electrical"), `${stats.mwhElectricPerHour} MWh/h`],
                    ].map(([lbl, val]) => (
                      <Box key={lbl as string}>
                        <Typography sx={{ fontSize: "0.59rem", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em", mb: "0.1rem" }}>{lbl}</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.85rem", xl: "0.95rem" }, lineHeight: 1.2 }}>{val}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Total amount mode */}
                <Box sx={{ mb: "1rem", border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "1rem", py: "0.65rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <FaClock size={11} color="#888" />
                      <Typography sx={{ fontWeight: 700, fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "#555" }}>
                        {tStr(t, "calc.totalAmount.label", "Calculate processing time")}
                      </Typography>
                    </Box>
                    <Switch
                      size="small"
                      checked={totalAmountMode}
                      onChange={(e) => setTotalAmountMode(e.target.checked)}
                      sx={{ "& .MuiSwitch-thumb": { bgcolor: totalAmountMode ? "#0000FF" : "#ccc" }, "& .MuiSwitch-track": { bgcolor: totalAmountMode ? "#0000FF50" : "#e0e0e0" } }}
                    />
                  </Box>
                  <Collapse in={totalAmountMode}>
                    <Box sx={{ px: "1rem", pb: "1rem", borderTop: "1px solid #f2f2f2" }}>
                      <Typography sx={{ fontSize: "0.72rem", color: "#888", mt: "0.65rem", mb: "0.75rem" }}>
                        {tStr(t, "calc.totalAmount.hint", "Enter the total amount of waste to process")}
                      </Typography>
                      <Box sx={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                        <FloatInput
                          value={totalAmountValue}
                          onChange={setTotalAmountValue}
                          unit={totalAmountUnit}
                          min={0} max={9999999} step={totalAmountUnit === "t" ? 1 : 100}
                          sx={{ flex: 1 }}
                        />
                        <ToggleButtonGroup
                          exclusive
                          value={totalAmountUnit}
                          onChange={(_, v) => v && setTotalAmountUnit(v)}
                          size="small"
                          sx={{ "& .MuiToggleButton-root": { borderRadius: 0, fontWeight: 700, fontSize: "0.75rem", px: "0.75rem", border: "1px solid #ddd", "&.Mui-selected": { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#333" } } } }}
                        >
                          <ToggleButton value="t">t</ToggleButton>
                          <ToggleButton value="kg">kg</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                      {stats.hoursToProcess !== null && (
                        <Box sx={{ mt: "0.75rem", p: "0.6rem", bgcolor: "#000", color: "#fff", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <FaClock size={14} />
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1 }}>
                              {stats.hoursToProcess < 1 ? `${Math.round(stats.hoursToProcess * 60)} ${tStr(t, "unit.minutes", "minutes")}` : `${stats.hoursToProcess.toFixed(2)} ${tStr(t, "unit.hours", "hours")}`}
                            </Typography>
                            <Typography sx={{ fontSize: "0.65rem", opacity: 0.55, mt: "0.15rem" }}>
                              {tStr(t, "calc.totalAmount.result", "to process at current throughput rate")}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      {!stats.hasInput && totalAmountMode && (
                        <Typography sx={{ fontSize: "0.7rem", color: "#ccc", mt: "0.5rem" }}>
                          {tStr(t, "calc.totalAmount.noMix", "Add waste types with throughput to calculate")}
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </Box>

                {/* Methodology accordion */}
                <Box sx={{ mb: "0.75rem", border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "1rem", py: "0.7rem", cursor: "pointer", userSelect: "none" }} onClick={() => setAdvancedOpen((o) => !o)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <FaFlask size={11} color="#999" />
                      <Typography sx={{ fontWeight: 700, fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "#666" }}>
                        {tStr(t, "calc.methodology.title", "Moisture correction — EN 14918")}
                      </Typography>
                    </Box>
                    {advancedOpen ? <FaChevronUp size={11} color="#bbb" /> : <FaChevronDown size={11} color="#bbb" />}
                  </Box>
                  <Collapse in={advancedOpen}>
                    <Box sx={{ px: "1rem", pb: "1rem", borderTop: "1px solid #f2f2f2" }}>
                      <Box sx={{ mt: "0.75rem", p: "0.65rem", bgcolor: "#f5f5f5", fontFamily: "monospace", fontSize: "0.75rem", color: "#222", borderLeft: "3px solid #0000FF" }}>
                        NCV_ar = HHV_dry × (1 − M/100) − 2.443 × (M/100)
                      </Box>
                      <Typography sx={{ fontSize: "0.73rem", color: "#666", lineHeight: 1.65, mt: "0.6rem" }}>
                        <strong>M</strong> = {tStr(t, "calc.methodology.moisture", "moisture %")}. <strong>2.443 MJ/kg</strong> = {tStr(t, "calc.methodology.latentHeat", "latent heat of vaporisation at 25°C")}.
                        {" "}{tStr(t, "calc.methodology.explanation", "Two loss mechanisms: (1) mass dilution by inert water, (2) evaporation energy during combustion. Non-linear — wet waste loses disproportionately more.")}
                      </Typography>
                      <Typography sx={{ fontSize: "0.68rem", color: "#bbb", mt: "0.6rem" }}>
                        η = 21.18% — {tStr(t, "calc.methodology.calibration", "WP1000 ref: 1 t/h biomass @ HHV 17 MJ/kg → 1 MWh electrical")}
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>

                {/* Export PDF */}
                <Box sx={{ mb: "0.75rem" }}>
                  <Button
                    onClick={handleExportPDF}
                    startIcon={<FaFilePdf size={13} />}
                    sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, borderRadius: 0, px: "1.25rem", py: "0.55rem", fontSize: { xs: "0.82rem", xl: "0.9rem" }, textTransform: "none", "&:hover": { bgcolor: "#0000FF" } }}
                  >
                    {tStr(t, "calc.exportPdf", "Export PDF Report")}
                  </Button>
                </Box>
              </Box>

              {/* ════ RIGHT COLUMN ════ */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {!stats.hasInput && (
                  <Box sx={{ p: "2rem", border: "2px dashed #ddd", textAlign: "center" }}>
                    <Typography sx={{ color: "#d0d0d0", fontSize: "0.85rem" }}>
                      {tStr(t, "calc.emptyResults", "Configure your waste mix to see annual impact projections")}
                    </Typography>
                  </Box>
                )}

                {/* Processing time card (top, highlighted) */}
                {hoursCard && (
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.6rem" }}>
                    <ImpactCard {...hoursCard} />
                  </Box>
                )}

                {/* Metric cards 3×3 */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: { xs: "0.55rem", xl: "0.7rem" } }}>
                  {metrics.map((m) => (
                    <ImpactCard key={m.label} {...m} />
                  ))}
                </Box>

                {/* Energy breakdown */}
                {stats.breakdown.length > 0 && (
                  <Box sx={{ border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                    <Box sx={{ px: "1rem", py: "0.6rem", borderBottom: "1px solid #f0f0f0" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "#888" }}>
                        {tStr(t, "calc.breakdown.title", "Energy contribution by type")}
                      </Typography>
                    </Box>
                    <Box sx={{ p: "0.85rem" }}>
                      {stats.breakdown.map((row) => {
                        const wt = allTypes.find((w) => w.key === row.key)!;
                        const pct = stats.totalEnergyMJPerHour > 0 ? (row.energyMJ / stats.totalEnergyMJPerHour) * 100 : 0;
                        return (
                          <Box key={row.key} sx={{ mb: "0.6rem" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.18rem" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <Box component="img" src={wt.image} alt={row.label} sx={{ width: 18, height: 18, objectFit: "cover", flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                <Typography sx={{ fontSize: "0.74rem", fontWeight: 600, color: "#222" }}>{row.label}</Typography>
                                <Typography sx={{ fontSize: "0.62rem", color: "#ccc", fontFamily: "monospace" }}>{row.tonnes.toFixed(2)} t/h · {row.ncvArVal.toFixed(1)} MJ/kg</Typography>
                              </Box>
                              <Typography sx={{ fontSize: "0.74rem", fontWeight: 700, color: wt.color, ml: "0.5rem", flexShrink: 0 }}>{pct.toFixed(1)}%</Typography>
                            </Box>
                            <Box sx={{ height: 3, bgcolor: "#f0f0f0" }}>
                              <Box sx={{ height: "100%", width: `${pct}%`, bgcolor: wt.color, transition: "width 0.3s ease" }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Disclaimer */}
                <Box sx={{ border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "0.45rem", px: "1rem", py: "0.65rem", cursor: "pointer", userSelect: "none" }} onClick={() => setDisclaimerOpen((o) => !o)}>
                    <FaInfoCircle size={12} color="#aaa" />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#666", flex: 1 }}>
                      {tStr(t, "calc.disclaimer.trigger", "Estimates based on the Cluj – CMID project")}
                    </Typography>
                    {disclaimerOpen ? <FaChevronUp size={10} color="#ccc" /> : <FaChevronDown size={10} color="#ccc" />}
                  </Box>
                  <Collapse in={disclaimerOpen}>
                    <Box sx={{ px: "1rem", pb: "1rem", borderTop: "1px solid #f5f5f5" }}>
                      <Typography sx={{ fontSize: "0.73rem", color: "#666", lineHeight: 1.7, mt: "0.7rem" }}>
                        {tStr(t, "calc.disclaimer.body", "All figures are approximate estimates based on the Cluj – CMID reference installation: 2× WP1500 units, 70 t/day, 25,550 t/year, 24/7 operation with maintenance on ~10 major holidays")} ({CONSTANTS.uptimePct}% {tStr(t, "calc.disclaimer.uptime", "uptime")}, {CONSTANTS.annualHours} h/yr).
                      </Typography>
                      <Typography sx={{ fontSize: "0.73rem", color: "#ED1C24", fontWeight: 700, lineHeight: 1.7, mt: "0.4rem" }}>
                        ⚠ {tStr(t, "calc.disclaimer.warning", "Output depends on HHV, moisture, ash content, and particle size. Adjust per-type moisture in each row.")}
                      </Typography>
                      <Box sx={{ mt: "0.7rem", pt: "0.7rem", borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {[
                          [tStr(t, "calc.disclaimer.src.moisture", "Moisture formula"), "EN 14918 / ISO 1928"],
                          [tStr(t, "calc.disclaimer.src.households", "Households"), "EU avg 3.6 MWh/yr · Eurostat 2023"],
                          [tStr(t, "calc.disclaimer.src.co2", "CO₂ avoided"), "0.30 t/tonne MSW · IPCC Tier II"],
                          [tStr(t, "calc.disclaimer.src.cars", "Cars removed"), "107 g/km × 12,000 km/yr · EEA 2023"],
                          [tStr(t, "calc.disclaimer.src.trees", "Trees equiv."), "45 trees/t CO2/yr · US EPA 2024"],
                        ].map(([lbl, src]) => (
                          <Typography key={lbl} sx={{ fontSize: "0.68rem", color: "#aaa", lineHeight: 1.5 }}>
                            <strong style={{ color: "#555" }}>{lbl}:</strong> {src}
                          </Typography>
                        ))}
                      </Box>
                      <Typography sx={{ fontSize: "0.66rem", color: "#ddd", mt: "0.5rem" }}>
                        {tStr(t, "calc.disclaimer.footer", "Not a binding commercial proposal")} · Waste Powertech SRL · wpowertech.ro
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>

              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>
    </>
  );
}
