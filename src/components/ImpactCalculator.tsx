import { useMemo, useState } from "react";
import { Box, Container, Slider, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import {
  FaBolt,
  FaLeaf,
  FaCarSide,
  FaTree,
  FaRecycle,
  FaIndustry,
  FaServer,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

const BRAND = {
  waste: "#8E8E8E",
  power: "#ED1C24",
  tech: "#0000FF",
};

type ImpactCardProps = {
  value: string;
  label: string;
  sub: string;
  color: string;
  icon: IconType;
};

function ImpactCard({ value, label, sub, color, icon: Icon }: ImpactCardProps) {
  return (
    <Box
      sx={{
        p: { xs: "1rem", xl: "1.5rem" },
        bgcolor: color,
        color: "#fff",
        border: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: { xs: "9rem", xl: "12rem" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "0.75rem" }}>
        <Icon size={22} />
      </Box>
      <Typography
        sx={{
          fontSize: { xs: "1.6rem", xl: "2rem", xxxl: "2.5rem" },
          fontWeight: 800,
          lineHeight: 1,
          mb: "0.5rem",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.8rem", xl: "0.95rem", xxxl: "1.1rem" },
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          mb: "0.5rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.78rem", xl: "0.9rem", xxxl: "1rem" },
          opacity: 0.8,
        }}
      >
        {sub}
      </Typography>
    </Box>
  );
}

export default function ImpactCalculator() {
  const { t } = useTranslation();
  const [tonsPerHour, setTonsPerHour] = useState<number>(1);

  const stats = useMemo(() => {
    const annualHours = 8000;
    const totalTonsYear = tonsPerHour * annualHours;
    const totalMWhYear = totalTonsYear;

    const modules = Math.ceil(tonsPerHour);
    const households = Math.floor(totalMWhYear / 3.5);
    const co2Saved = Math.floor(totalTonsYear * 1.1);
    const treesPlanted = co2Saved * 45;
    const carsRemoved = Math.floor(co2Saved / 4.6);

    return {
      modules,
      households: households.toLocaleString(),
      co2Saved: co2Saved.toLocaleString(),
      treesPlanted: treesPlanted.toLocaleString(),
      carsRemoved: carsRemoved.toLocaleString(),
      totalMWhYear: totalMWhYear.toLocaleString(),
    };
  }, [tonsPerHour]);

  const handleSliderChange = (_: Event, val: number | number[]) => {
    setTonsPerHour(Array.isArray(val) ? val[0] : val);
  };

  const metrics: ImpactCardProps[] = [
    { value: stats.totalMWhYear, label: "MWh / Year", sub: "Energy generated", color: BRAND.power, icon: FaBolt },
    { value: stats.households, label: "Households", sub: "Powered per year", color: BRAND.power, icon: FaIndustry },
    { value: `${stats.co2Saved} t`, label: "CO2 Offset", sub: "Landfill emissions avoided", color: BRAND.waste, icon: FaLeaf },
    { value: stats.treesPlanted, label: "Trees", sub: "Equivalent sequestration", color: BRAND.waste, icon: FaTree },
    { value: stats.carsRemoved, label: "Cars", sub: "Removed from roads annually", color: BRAND.waste, icon: FaCarSide },
    { value: "97.4%", label: "Waste Recovery", sub: "Material diversion rate", color: BRAND.waste, icon: FaRecycle },
    { value: "99.3%", label: "System Uptime", sub: "Operational availability", color: BRAND.tech, icon: FaServer },
    { value: "A+", label: "Compliance", sub: "Audit readiness score", color: BRAND.tech, icon: FaShieldAlt },
    { value: "24/7", label: "Grid Response", sub: "Continuous load support", color: BRAND.tech, icon: FaChartLine },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <Box
        id="calculator"
        sx={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          py: { xs: "5rem", xl: "10rem" },
          bgcolor: "#f9f9f9",
          borderLeft: { xs: "0.5rem solid #0000FF", xl: "1.5rem solid #0000FF" },
          px: { xs: "1.5rem", xl: "4%", xxxl: "6%" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: { xs: "1.5rem", xl: "4%", xxxl: "6%" },
            right: { xs: "1.5rem", xl: "4%", xxxl: "6%" },
            borderTop: "0.25rem solid #000000",
          },
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "5fr 7fr" },
              gap: { xs: "3rem", xl: "5rem" },
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: { xs: "block", sm: "grid" },
                  gridTemplateColumns: { sm: "auto 1fr" },
                  columnGap: { sm: "1.25rem", lg: "1.75rem" },
                  alignItems: "center",
                  mb: "2rem",
                }}
              >
                <Box
                  component="img"
                  src="/wpt-black-full-length-logo.svg"
                  alt="Waste Power Tech logo"
                  sx={{
                    display: { xs: "block", sm: "none" },
                    width: "clamp(20rem, 42vw, 13rem)",
                    height: "auto",
                    mb: "1.25rem",
                  }}
                />
                <Box
                  component="img"
                  src="/wpt-black-compact-logo.svg"
                  alt="Waste Power Tech logo"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    width: { sm: "85rem", lg: "10rem", xl: "15rem", xxxl: "20rem" },
                    height: "auto",
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    mb: 0,
                    fontSize: { xs: "2.5rem", md: "3rem", xl: "4.5rem", xxxl: "6rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {t("calculator-title")}
                </Typography>
              </Box>

              <Box sx={{ mb: "4rem" }}>
                <Typography
                  sx={{
                    mb: "2rem",
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", xl: "2rem", xxxl: "2.5rem" },
                  }}
                >
                  {tonsPerHour.toFixed(1)} t/h
                </Typography>

                <Slider
                  value={tonsPerHour}
                  min={0.5}
                  max={20}
                  step={0.5}
                  onChange={handleSliderChange}
                  sx={{
                    color: "#0000FF",
                    height: { xs: 8, xl: 16 },
                    "& .MuiSlider-thumb": {
                      width: { xs: 24, xl: 42 },
                      height: { xs: 24, xl: 42 },
                      backgroundColor: "#0000FF",
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 0 0 15px rgba(0, 0, 255, 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": { opacity: 0.2, backgroundColor: "#000" },
                  }}
                />

                <Typography
                  sx={{
                    mt: "2rem",
                    color: "#666",
                    fontSize: { xs: "1rem", xl: "1.5rem", xxxl: "2rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Module basis: {stats.modules}x WP1000
                </Typography>
              </Box>

              <Box sx={{ fontSize: { xs: "1.1rem", xl: "1.75rem", xxxl: "2.2rem" } }}>
                <Link
                  to="/calculator"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    fontWeight: 700,
                    borderBottom: "3px solid #000",
                  }}
                >
                  Full analysis {"->"}
                </Link>
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", lg: "1fr 1fr 1fr" },
                gap: { xs: "0.75rem", xl: "1rem" },
              }}
            >
              {metrics.map((metric) => (
                <ImpactCard
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                  sub={metric.sub}
                  color={metric.color}
                  icon={metric.icon}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
}
