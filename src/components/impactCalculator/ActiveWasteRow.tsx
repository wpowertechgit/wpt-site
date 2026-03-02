import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { tStr } from "./i18n";
import type { WasteType } from "./model";
import FloatInput from "./FloatInput";

interface ActiveWasteRowProps {
  wasteType: WasteType;
  tonnes: number;
  moisture: number;
  ncvArVal: number;
  onTonnesChange: (value: number) => void;
  onMoistureChange: (value: number) => void;
  onRemove: () => void;
  onInfoClick: () => void;
}

export default function ActiveWasteRow({
  wasteType,
  tonnes,
  moisture,
  ncvArVal,
  onTonnesChange,
  onMoistureChange,
  onRemove,
  onInfoClick,
}: ActiveWasteRowProps) {
  const { t } = useTranslation();
  const label = wasteType.displayName?.trim() || tStr(t, wasteType.key, wasteType.key);

  return (
    <motion.div layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "auto 1fr", sm: "auto 1fr auto" }, gap: { xs: "0.65rem", sm: "0.85rem", xxl: "1rem", xxxl: "1.2rem" }, alignItems: "center", p: { xs: "0.7rem", xxl: "0.9rem", xxxl: "1.05rem" }, border: `1px solid ${wasteType.color}28`, bgcolor: `${wasteType.color}04`, mb: "0.45rem", borderLeft: `3px solid ${wasteType.color}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.55rem", cursor: "pointer" }} onClick={onInfoClick}>
          <Box sx={{ width: { xs: 38, xl: 44, xxl: 50, xxxl: 58 }, height: { xs: 38, xl: 44, xxl: 50, xxxl: 58 }, flexShrink: 0, overflow: "hidden", bgcolor: "#111", position: "relative", "&:hover .tov": { opacity: 1 } }}>
            <Box component="img" src={wasteType.image} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(event) => { (event.target as HTMLImageElement).style.display = "none"; }} />
            <Box className="tov" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.15s" }}>
              <FaInfoCircle size={12} color="#fff" />
            </Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.8rem", xxl: "0.92rem", xxxl: "1.08rem" }, lineHeight: 1.2, color: "#1a1a1a" }}>{label}</Typography>
            <Typography sx={{ fontSize: { xs: "0.63rem", xxl: "0.72rem", xxxl: "0.84rem" }, fontFamily: "monospace", color: ncvArVal > 0 ? wasteType.color : "#ccc", fontWeight: 600 }}>
              NCV_ar {ncvArVal.toFixed(2)} MJ/kg
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <FloatInput value={tonnes} onChange={onTonnesChange} unit={tStr(t, "unit.th", "t/h")} min={0} max={9999} step={0.5} />
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Typography sx={{ fontSize: { xs: "0.63rem", xxl: "0.72rem", xxxl: "0.84rem" }, color: "#ccc", flexShrink: 0 }}>{tStr(t, "calc.row.moisture", "Moisture")}:</Typography>
            <Slider
              size="small"
              value={moisture}
              min={0}
              max={60}
              step={0.5}
              onChange={(_, value) => onMoistureChange(Array.isArray(value) ? value[0] : value)}
              sx={{ flex: 1, color: wasteType.color, py: { xs: "3px", xxl: "6px", xxxl: "8px" }, "& .MuiSlider-thumb": { width: { xs: 10, xxl: 16, xxxl: 20 }, height: { xs: 10, xxl: 16, xxxl: 20 }, bgcolor: wasteType.color }, "& .MuiSlider-rail": { opacity: 0.15, height: { xxl: 5, xxxl: 6 } }, "& .MuiSlider-track": { height: { xxl: 5, xxxl: 6 } } }}
            />
            <Typography sx={{ fontSize: { xs: "0.67rem", xxl: "0.76rem", xxxl: "0.9rem" }, fontWeight: 600, color: "#555", minWidth: { xs: "2rem", xxl: "2.4rem", xxxl: "2.8rem" }, textAlign: "right", flexShrink: 0 }}>{moisture.toFixed(1)}%</Typography>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <IconButton size="small" onClick={onRemove} sx={{ border: "1px solid #e8e8e8", borderRadius: 0, p: { xs: "4px", xxl: "8px", xxxl: "10px" }, minWidth: { xxl: "2.5rem", xxxl: "3rem" }, minHeight: { xxl: "2.5rem", xxxl: "3rem" }, color: "#ccc", "& svg": { width: { xxl: "0.9rem", xxxl: "1.1rem" }, height: { xxl: "0.9rem", xxxl: "1.1rem" } }, "&:hover": { border: "1px solid #ED1C24", color: "#ED1C24", bgcolor: "#fff0f0" } }}>
            <FaTimes size={10} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "flex-end", mb: "0.4rem", mt: "-0.2rem" }}>
        <Button size="small" onClick={onRemove} sx={{ fontSize: { xs: "0.63rem", xxl: "0.82rem", xxxl: "0.98rem" }, color: "#ccc", textTransform: "none", p: { xs: "0.1rem 0.4rem", xxl: "0.25rem 0.7rem", xxxl: "0.35rem 0.9rem" }, minWidth: 0, "& .MuiButton-startIcon svg": { width: { xxl: "0.8rem", xxxl: "0.95rem" }, height: { xxl: "0.8rem", xxxl: "0.95rem" } }, "&:hover": { color: "#ED1C24" } }} startIcon={<FaTimes size={8} />}>
          {tStr(t, "common.remove", "Remove")}
        </Button>
      </Box>
    </motion.div>
  );
}
