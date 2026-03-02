import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";
import { getWasteDescription, getWasteLabel, getWasteTypicalSources, tStr } from "./i18n";
import { ncvAr, type WasteType } from "./model";

interface WasteInfoDialogProps {
  wasteType: WasteType | null;
  open: boolean;
  onClose: () => void;
}

export default function WasteInfoDialog({ wasteType, open, onClose }: WasteInfoDialogProps) {
  const { t } = useTranslation();

  if (!wasteType) {
    return null;
  }

  const ncvDefault = ncvAr(wasteType.hhvDry, wasteType.defaultMoisture);
  const label = getWasteLabel(t, wasteType);
  const description = getWasteDescription(t, wasteType);
  const typicalSources = getWasteTypicalSources(t, wasteType);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 0, border: `3px solid ${wasteType.color}` } }}>
      <DialogTitle sx={{ p: 0, position: "relative" }}>
        <Box sx={{ height: 170, overflow: "hidden", position: "relative", bgcolor: "#111" }}>
          <Box component="img" src={wasteType.image} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(event) => { (event.target as HTMLImageElement).style.display = "none"; }} />
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
        {description && <Typography sx={{ fontSize: "0.84rem", color: "#444", lineHeight: 1.7, mb: "1rem", whiteSpace: "pre-line" }}>{description}</Typography>}
        <Box sx={{ mb: "0.9rem" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", mb: "0.4rem", color: "#999" }}>{tStr(t, "calc.info.characteristics", "Key Characteristics")}</Typography>
          {wasteType.characteristics.map((characteristic) => (
            <Box key={characteristic} sx={{ display: "flex", alignItems: "center", gap: "0.4rem", mb: "0.2rem" }}>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: wasteType.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.77rem", color: "#555" }}>{characteristic}</Typography>
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
