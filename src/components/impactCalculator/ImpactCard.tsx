import { Box, Typography } from "@mui/material";
import type { IconType } from "react-icons";

export interface ImpactCardProps {
  value: string;
  label: string;
  sub: string;
  color: string;
  icon: IconType;
  highlight?: boolean;
}

export default function ImpactCard({ value, label, sub, color, icon: Icon, highlight }: ImpactCardProps) {
  return (
    <Box sx={{ p: { xs: "0.85rem", xl: "1rem", xxl: "1.2rem", xxxl: "1.45rem" }, bgcolor: color, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: { xs: "7.5rem", xl: "9.5rem", xxl: "11rem", xxxl: "13rem" }, outline: highlight ? "2px solid #0000FF" : "none", outlineOffset: 2 }}>
      <Box sx={{ mb: "0.4rem" }}>
        <Icon size={17} />
      </Box>
      <Typography sx={{ fontSize: { xs: "1.2rem", xl: "1.55rem", xxl: "1.8rem", xxxl: "2.1rem" }, fontWeight: 800, lineHeight: 1, mb: "0.25rem" }}>{value}</Typography>
      <Typography sx={{ fontSize: { xs: "0.62rem", xl: "0.75rem", xxl: "0.86rem", xxxl: "1rem" }, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: "0.2rem" }}>{label}</Typography>
      <Typography sx={{ fontSize: { xs: "0.58rem", xl: "0.68rem", xxl: "0.78rem", xxxl: "0.9rem" }, opacity: 0.75 }}>{sub}</Typography>
    </Box>
  );
}
