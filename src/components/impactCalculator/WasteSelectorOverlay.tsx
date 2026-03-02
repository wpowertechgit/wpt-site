import { Box, Button, IconButton, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCheck, FaLayerGroup, FaTimes } from "react-icons/fa";
import { getWasteLabel, tStr } from "./i18n";
import { WASTE_TYPES, type WasteType } from "./model";

interface WasteSelectorOverlayProps {
  open: boolean;
  onClose: () => void;
  activeKeys: Set<string>;
  onToggle: (key: string) => void;
  onOpenCustomBuilder: () => void;
  customTypes: WasteType[];
}

export default function WasteSelectorOverlay({
  open,
  onClose,
  activeKeys,
  onToggle,
  onOpenCustomBuilder,
  customTypes,
}: WasteSelectorOverlayProps) {
  const { t } = useTranslation();
  const allTypes = [...WASTE_TYPES, ...customTypes];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "fixed", inset: 0, zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(3px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
              style={{ background: "#fff", width: "min(100%, 94vw)", maxWidth: "min(112rem, 90vw)", maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: "1rem", sm: "1.5rem", xxl: "1.4vw", xxxl: "1.6vw" }, py: { xs: "0.9rem", sm: "1.1rem", xxl: "1vw", xxxl: "1.1vw" }, borderBottom: "2px solid #000", flexShrink: 0 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "1.1rem", sm: "1.3rem", xxl: "1.35vw", xxxl: "1.65vw" }, lineHeight: 1.05 }}>
                  {tStr(t, "calc.selector.title", "Select Waste Types")}
                </Typography>
                <Typography sx={{ fontSize: { xs: "0.72rem", sm: "0.75rem", xxl: "0.82vw", xxxl: "1vw" }, color: "#888", mt: "0.25rem", lineHeight: 1.4 }}>
                  {tStr(t, "calc.selector.subtitle", "Click to add or remove from your mix")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: { xs: "0.3rem", xxl: "0.5vw", xxxl: "0.6vw" }, alignItems: "center" }}>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenCustomBuilder();
                  }}
                  startIcon={<FaLayerGroup size={12} />}
                  sx={{ bgcolor: "#0000FF", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "0.5rem", sm: "1rem", xxl: "1.15vw", xxxl: "1.35vw" }, py: { xs: "0.35rem", sm: "0.45rem", xxl: "0.62vw", xxxl: "0.75vw" }, fontSize: { xs: "0.65rem", sm: "0.78rem", xxl: "0.96vw", xxxl: "1.16vw" }, textTransform: "none", "& .MuiButton-startIcon svg": { width: { xxl: "0.95vw", xxxl: "1.12vw" }, height: { xxl: "0.95vw", xxxl: "1.12vw" } }, "&:hover": { bgcolor: "#0000cc" }, whiteSpace: "normal", lineHeight: 1.3 }}
                >
                  {tStr(t, "calc.selector.createCustom", "Create Custom Mix")}
                </Button>
                <IconButton onClick={onClose} size="small" sx={{ border: "2px solid #000", borderRadius: 0, p: { xs: "0.25rem", sm: "0.3rem", xxl: "0.5vw", xxxl: "0.62vw" }, minWidth: { xxl: "2.9vw", xxxl: "3.35vw" }, minHeight: { xxl: "2.9vw", xxxl: "3.35vw" }, "& svg": { width: { xxl: "1vw", xxxl: "1.18vw" }, height: { xxl: "1vw", xxxl: "1.18vw" } } }}>
                  <FaTimes size={14} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ overflowY: "auto", p: { xs: "0.85rem", sm: "1.25rem", xxl: "1.15vw", xxxl: "1.35vw" }, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: { xs: "0.55rem", sm: "0.75rem", xxl: "0.8vw", xxxl: "0.95vw" } }}>
              {allTypes.map((wasteType) => {
                const isSelected = activeKeys.has(wasteType.key);
                const label = getWasteLabel(t, wasteType);

                return (
                  <Box
                    key={wasteType.key}
                    onClick={() => onToggle(wasteType.key)}
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      border: isSelected ? `2px solid ${wasteType.color}` : "2px solid #e8e8e8",
                      bgcolor: isSelected ? `${wasteType.color}10` : "#fafafa",
                      transition: "all 0.15s",
                      "&:hover": { border: `2px solid ${wasteType.color}`, bgcolor: `${wasteType.color}08` },
                    }}
                  >
                    <Box sx={{ position: "relative", height: { xs: "4.75rem", sm: "5.5rem", xxl: "6.2vw", xxxl: "7vw" }, overflow: "hidden", bgcolor: "#111" }}>
                      <Box component="img" src={wasteType.image} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: isSelected ? 1 : 0.6, transition: "opacity 0.15s" }} onError={(event) => { (event.target as HTMLImageElement).style.display = "none"; }} />
                      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", bgcolor: wasteType.color }} />
                      {wasteType.isCustom && (
                        <Box sx={{ position: "absolute", top: "0.3rem", left: "0.3rem", bgcolor: "#0000FF", px: { xs: "0.25rem", xxl: "0.3vw", xxxl: "0.36vw" }, py: { xs: "0.08rem", xxl: "0.1vw", xxxl: "0.12vw" } }}>
                          <Typography sx={{ fontSize: { xs: "0.48rem", sm: "0.55rem", xxl: "0.56vw", xxxl: "0.68vw" }, color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {tStr(t, "calc.customMix.badge", "Custom")}
                          </Typography>
                        </Box>
                      )}
                      {isSelected && (
                        <Box sx={{ position: "absolute", top: "0.3rem", right: "0.3rem", width: { xs: 18, sm: 20, xxl: "1.35vw", xxxl: "1.6vw" }, height: { xs: 18, sm: 20, xxl: "1.35vw", xxxl: "1.6vw" }, bgcolor: wasteType.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaCheck size={10} color="#fff" />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ px: { xs: "0.45rem", sm: "0.55rem", xxl: "0.5vw", xxxl: "0.6vw" }, py: { xs: "0.45rem", sm: "0.5rem", xxl: "0.45vw", xxxl: "0.55vw" } }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.66rem", sm: "0.75rem", xxl: "0.82vw", xxxl: "1vw" }, lineHeight: 1.2, mb: "0.1rem", overflowWrap: "anywhere" }}>{label}</Typography>
                      <Typography sx={{ fontSize: { xs: "0.56rem", sm: "0.62rem", xxl: "0.66vw", xxxl: "0.8vw" }, color: "#aaa", fontFamily: "monospace" }}>
                        {wasteType.hhvDry.toFixed(1)} MJ/kg dry
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ px: { xs: "1rem", sm: "1.5rem", xxl: "1.4vw", xxxl: "1.6vw" }, py: { xs: "0.8rem", sm: "1rem", xxl: "0.9vw", xxxl: "1vw" }, borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, bgcolor: "#fafafa" }}>
              <Typography sx={{ fontSize: { xs: "0.72rem", sm: "0.78rem", xxl: "0.84vw", xxxl: "1vw" }, color: "#888" }}>
                {activeKeys.size} {tStr(t, "calc.selector.typesSelected", "type(s) selected")}
              </Typography>
              <Button
                onClick={onClose}
                sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "0.75rem", sm: "1.5rem", xxl: "1.45vw", xxxl: "1.7vw" }, py: { xs: "0.4rem", sm: "0.5rem", xxl: "0.68vw", xxxl: "0.82vw" }, fontSize: { xs: "0.75rem", sm: "0.85rem", xxl: "1vw", xxxl: "1.22vw" }, textTransform: "none", whiteSpace: "normal", lineHeight: 1.3, "&:hover": { bgcolor: "#0000FF" } }}
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
