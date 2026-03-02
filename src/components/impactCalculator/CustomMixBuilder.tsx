import { Box, Button, IconButton, InputAdornment, Slider, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLayerGroup, FaTimes } from "react-icons/fa";
import DonutChart from "./DonutChart";
import { tStr } from "./i18n";
import {
  clampFloat,
  computeWeightedHhvAndMoisture,
  createEmptyCustomComposition,
  CUSTOM_MIX_COMPONENT_TYPES,
  ncvAr,
  type WasteType,
} from "./model";

interface CustomMixDraft {
  name: string;
  composition: Record<string, number>;
  moisture: number;
}

interface CustomMixBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (mix: WasteType) => void;
}

export default function CustomMixBuilder({ open, onClose, onSave }: CustomMixBuilderProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<CustomMixDraft>({
    name: "",
    composition: createEmptyCustomComposition(),
    moisture: 15,
  });
  const [nameError, setNameError] = useState("");
  const customMixIdRef = useRef(0);

  const totalPct = Object.values(draft.composition).reduce((sum, value) => sum + value, 0);
  const remaining = Math.max(0, 100 - totalPct);
  const segments = CUSTOM_MIX_COMPONENT_TYPES.map((wasteType) => ({
    key: wasteType.key,
    pct: draft.composition[wasteType.key] ?? 0,
    color: wasteType.color,
    label: tStr(t, wasteType.key, wasteType.key),
  }));
  const { hhvDry: blendedHhv } = computeWeightedHhvAndMoisture(draft.composition);
  const blendedNcv = ncvAr(blendedHhv, draft.moisture);

  const setCompositionKey = useCallback((key: string, raw: string) => {
    const nextValue = clampFloat(raw, 0, 100);
    setDraft((prev) => {
      const next = { ...prev.composition, [key]: nextValue };
      const sum = Object.values(next).reduce((acc, value) => acc + value, 0);

      if (sum > 100) {
        next[key] = Math.max(0, nextValue - (sum - 100));
      }

      return { ...prev, composition: next };
    });
  }, []);

  const handleSave = () => {
    const trimmedName = draft.name.trim().replace(/[^a-zA-Z0-9 _-]/g, "");

    if (!trimmedName) {
      setNameError(tStr(t, "calc.customMix.nameRequired", "Please enter a name"));
      return;
    }

    if (totalPct < 99) {
      return;
    }

    const { hhvDry: blendHhv } = computeWeightedHhvAndMoisture(draft.composition);
    const nextCustomKey = `custom-${customMixIdRef.current}`;
    customMixIdRef.current += 1;
    const custom: WasteType = {
      key: nextCustomKey,
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
        `Composition: ${CUSTOM_MIX_COMPONENT_TYPES.filter((wasteType) => (draft.composition[wasteType.key] ?? 0) > 0).map((wasteType) => `${tStr(t, wasteType.key, wasteType.key)} ${draft.composition[wasteType.key]}%`).join(", ")}`,
      ],
      typicalSources: tStr(t, "calc.customMix.customSourcesPlaceholder", "Custom user-defined composition"),
    };

    onSave(custom);
    setDraft({ name: "", composition: createEmptyCustomComposition(), moisture: 15 });
    setNameError("");
  };

  if (!open) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{ background: "#fff", width: "100%", maxWidth: "1040px", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
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
          <IconButton onClick={onClose} size="small" sx={{ border: "2px solid #000", borderRadius: 0, p: { xs: "0.3rem", xxl: "0.55rem", xxxl: "0.7rem" }, minWidth: { xxl: "2.8rem", xxxl: "3.25rem" }, minHeight: { xxl: "2.8rem", xxxl: "3.25rem" }, "& svg": { width: { xxl: "1rem", xxxl: "1.2rem" }, height: { xxl: "1rem", xxxl: "1.2rem" } } }}>
            <FaTimes size={13} />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 220px" }, gap: 0 }}>
          <Box sx={{ p: "1.25rem", borderRight: { md: "1px solid #eee" } }}>
            <Box sx={{ mb: "1.1rem" }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.68rem", md: "0.72rem", xxl: "0.8rem", xxxl: "0.95rem" }, textTransform: "uppercase", letterSpacing: "0.09em", color: "#888", mb: "0.4rem" }}>
                {tStr(t, "calc.customMix.nameLabel", "Mix name")}
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={draft.name}
                onChange={(event) => {
                  const safe = event.target.value.replace(/[<>&"'/]/g, "").slice(0, 40);
                  setDraft((prev) => ({ ...prev, name: safe }));
                  setNameError("");
                }}
                placeholder={tStr(t, "calc.customMix.namePlaceholder", "e.g. Municipal MSW mix")}
                error={!!nameError}
                helperText={nameError}
                inputProps={{ maxLength: 40 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
              />
            </Box>

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
                <Box sx={{ height: "100%", width: `${Math.min(100, totalPct)}%`, bgcolor: totalPct > 100 ? "#ED1C24" : totalPct === 100 ? "#4a7c59" : "#0000FF", transition: "width 0.25s, background-color 0.2s" }} />
              </Box>
              {remaining > 0 && (
                <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.67rem", xxl: "0.75rem", xxxl: "0.9rem" }, color: "#aaa", mt: "0.25rem", lineHeight: 1.45 }}>
                  {remaining.toFixed(1)}% {tStr(t, "calc.customMix.remaining", "remaining to allocate")}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {CUSTOM_MIX_COMPONENT_TYPES.map((wasteType) => {
                const pct = draft.composition[wasteType.key] ?? 0;

                return (
                  <Box
                    key={wasteType.key}
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
                    <Box sx={{ width: 10, height: 10, bgcolor: wasteType.color, borderRadius: "50%", mx: "auto" }} />
                    <Typography sx={{ fontSize: { xs: "0.66rem", sm: "0.76rem", xxl: "0.86rem", xxxl: "1rem" }, fontWeight: 600, color: "#333", whiteSpace: { xs: "normal", sm: "nowrap" }, overflow: "hidden", textOverflow: { xs: "clip", sm: "ellipsis" }, overflowWrap: "anywhere", lineHeight: 1.2, minWidth: 0 }}>
                      {tStr(t, wasteType.key, wasteType.key)}
                    </Typography>
                    <Slider
                      size="small"
                      value={pct}
                      min={0}
                      max={100}
                      step={0.5}
                      onChange={(_, value) => setCompositionKey(wasteType.key, String(Array.isArray(value) ? value[0] : value))}
                      sx={{ color: wasteType.color, py: { xs: "4px", xxl: "7px", xxxl: "9px" }, minWidth: 0, "& .MuiSlider-thumb": { width: { xs: 12, xxl: 18, xxxl: 22 }, height: { xs: 12, xxl: 18, xxxl: 22 }, bgcolor: wasteType.color }, "& .MuiSlider-rail": { opacity: 0.15, height: { xxl: 5, xxxl: 6 } }, "& .MuiSlider-track": { height: { xxl: 5, xxxl: 6 } } }}
                    />
                    <TextField
                      size="small"
                      value={pct === 0 ? "" : pct}
                      onChange={(event) => setCompositionKey(wasteType.key, event.target.value)}
                      placeholder="0"
                      inputProps={{ inputMode: "decimal", pattern: "[0-9.]*", maxLength: 6 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ fontSize: { xs: "0.65rem", xxl: "0.74rem", xxxl: "0.86rem" }, color: "#aaa" }}>%</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0, "& fieldset": { borderColor: pct > 0 ? `${wasteType.color}80` : "#ddd" } }, minWidth: 0, "& input": { textAlign: "center", fontWeight: 700, fontSize: { xs: "0.82rem", xxl: "0.94rem", xxxl: "1.08rem" }, padding: { xs: "4px 2px", xxl: "6px 2px", xxxl: "8px 2px" } } }}
                    />
                  </Box>
                );
              })}
            </Box>

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
                onChange={(_, value) => setDraft((prev) => ({ ...prev, moisture: Array.isArray(value) ? value[0] : value }))}
                sx={{ color: "#555", py: { xxl: "7px", xxxl: "9px" }, "& .MuiSlider-thumb": { bgcolor: "#555", width: { xxl: 18, xxxl: 22 }, height: { xxl: 18, xxxl: 22 } }, "& .MuiSlider-rail": { opacity: 0.15, height: { xxl: 5, xxxl: 6 } }, "& .MuiSlider-track": { height: { xxl: 5, xxxl: 6 } } }}
              />
            </Box>
          </Box>

          <Box sx={{ p: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", bgcolor: "#fafafa", borderTop: { xs: "1px solid #eee", md: "none" } }}>
            <Typography sx={{ fontSize: { xs: "0.66rem", md: "0.7rem", xxl: "0.78rem", xxxl: "0.92rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#aaa", alignSelf: "flex-start" }}>
              {tStr(t, "calc.customMix.chartTitle", "Mix preview")}
            </Typography>
            <DonutChart segments={segments} size={150} />

            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {CUSTOM_MIX_COMPONENT_TYPES.filter((wasteType) => (draft.composition[wasteType.key] ?? 0) > 0).map((wasteType) => (
                <Box key={wasteType.key} sx={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: wasteType.color, borderRadius: "50%", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.68rem", xxl: "0.76rem", xxxl: "0.9rem" }, color: "#555", flex: 1, minWidth: 0, lineHeight: 1.35, overflowWrap: "anywhere" }}>{tStr(t, wasteType.key, wasteType.key)}</Typography>
                  <Typography sx={{ fontSize: { xs: "0.64rem", md: "0.68rem", xxl: "0.76rem", xxxl: "0.9rem" }, fontWeight: 700, color: wasteType.color, flexShrink: 0 }}>{(draft.composition[wasteType.key] ?? 0).toFixed(1)}%</Typography>
                </Box>
              ))}
            </Box>

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
            <Button onClick={onClose} sx={{ color: "#888", fontWeight: 600, borderRadius: 0, px: { xs: "1rem", xxl: "1.4rem", xxxl: "1.7rem" }, py: { xxl: "0.5rem", xxxl: "0.65rem" }, textTransform: "none", fontSize: { xs: "0.8rem", xxl: "1rem", xxxl: "1.18rem" }, "&:hover": { bgcolor: "#f5f5f5" } }}>
              {tStr(t, "common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={totalPct < 99.5 || totalPct > 100.5}
              sx={{ bgcolor: totalPct >= 99.5 && totalPct <= 100.5 ? "#000" : "#ddd", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "1.5rem", xxl: "2rem", xxxl: "2.4rem" }, py: { xs: "0.5rem", xxl: "0.8rem", xxxl: "1rem" }, fontSize: { xs: "0.82rem", xxl: "1.08rem", xxxl: "1.28rem" }, textTransform: "none", "&:hover": { bgcolor: totalPct >= 99.5 ? "#0000FF" : "#ddd" }, "&.Mui-disabled": { color: "#aaa" } }}
            >
              {tStr(t, "calc.customMix.saveButton", "Save Custom Mix")}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}
