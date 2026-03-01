import { useMemo, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FaBolt, FaChartLine, FaIndustry, FaLayerGroup } from "react-icons/fa";

const BRAND = {
  waste: "#8E8E8E",
  power: "#ED1C24",
  tech: "#0000FF",
};

function tStr(t: (key: string) => string, key: string, fallback: string) {
  const result = t(key);
  return result === key ? fallback : result;
}

type DemoPreset = {
  id: string;
  labelKey: string;
  labelFallback: string;
  color: string;
  modules: number;
  throughput: string;
  annualMWh: number;
  households: number;
  cityCoverage: number;
  configuration: string;
  feedstock: string;
};

const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "pilot",
    labelKey: "calc.demo.presetPilot",
    labelFallback: "Pilot",
    color: BRAND.waste,
    modules: 1,
    throughput: "1.0 t/h",
    annualMWh: 8500,
    households: 2360,
    cityCoverage: 0.8,
    configuration: "Single WP1000 line",
    feedstock: "Controlled municipal and biomass blend",
  },
  {
    id: "municipal",
    labelKey: "calc.demo.presetMunicipal",
    labelFallback: "Municipal",
    color: BRAND.power,
    modules: 3,
    throughput: "3.0 t/h",
    annualMWh: 25500,
    households: 7080,
    cityCoverage: 2.4,
    configuration: "Three synchronized process lines",
    feedstock: "Mixed municipal and industrial fractions",
  },
  {
    id: "regional",
    labelKey: "calc.demo.presetRegional",
    labelFallback: "Regional",
    color: BRAND.tech,
    modules: 6,
    throughput: "6.0 t/h",
    annualMWh: 51000,
    households: 14160,
    cityCoverage: 4.7,
    configuration: "Six-line modular deployment",
    feedstock: "Regional mixed waste intake",
  },
];

type MetricCardProps = {
  value: string;
  label: string;
  sub: string;
  color: string;
  icon: IconType;
};

function MetricCard({ value, label, sub, color, icon: Icon }: MetricCardProps) {
  return (
    <Box
      sx={{
        p: { xs: "0.95rem", xl: "1.1rem" },
        bgcolor: color,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: { xs: "8rem", xl: "9.5rem" },
      }}
    >
      <Box sx={{ mb: "0.45rem" }}>
        <Icon size={18} />
      </Box>
      <Typography
        sx={{
          fontSize: { xs: "1.3rem", xl: "1.6rem", xxxl: "2rem" },
          fontWeight: 800,
          lineHeight: 1,
          mb: "0.25rem",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.68rem", xl: "0.78rem", xxxl: "0.95rem" },
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          mb: "0.2rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.62rem", xl: "0.72rem", xxxl: "0.85rem" },
          opacity: 0.82,
        }}
      >
        {sub}
      </Typography>
    </Box>
  );
}

export default function ImpactCalculator() {
  const { t } = useTranslation();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(DEMO_PRESETS[1].id);

  const selectedPreset = useMemo(
    () => DEMO_PRESETS.find((preset) => preset.id === selectedPresetId) ?? DEMO_PRESETS[1],
    [selectedPresetId]
  );

  const maxAnnualMWh = useMemo(
    () => Math.max(...DEMO_PRESETS.map((preset) => preset.annualMWh)),
    []
  );

  const metrics: MetricCardProps[] = [
    {
      value: String(selectedPreset.modules),
      label: t("modules"),
      sub: tStr(t, "calc.demo.modulesSub", "Configured process lines"),
      color: BRAND.tech,
      icon: FaLayerGroup,
    },
    {
      value: selectedPreset.annualMWh.toLocaleString("en-US"),
      label: t("mwh-year"),
      sub: tStr(t, "calc.demo.energySub", "Reference annual output"),
      color: BRAND.power,
      icon: FaBolt,
    },
    {
      value: selectedPreset.households.toLocaleString("en-US"),
      label: t("households"),
      sub: tStr(t, "calc.demo.householdsSub", "Equivalent annual supply"),
      color: BRAND.waste,
      icon: FaIndustry,
    },
    {
      value: `${selectedPreset.cityCoverage}%`,
      label: t("city-coverage"),
      sub: tStr(t, "calc.demo.citySub", "Share of a 300,000-person city"),
      color: "#1a1a1a",
      icon: FaChartLine,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Box
        id="calculator"
        sx={{
          position: "relative",
          py: { xs: "4rem", xl: "7rem" },
          bgcolor: "#f9f9f9",
          borderLeft: { xs: "0.5rem solid #0000FF", xl: "1.25rem solid #0000FF" },
          px: { xs: "1.5rem", xl: "4%", xxl: "4%", xxxl: "6%" },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: { xs: "1.5rem", xl: "4%", xxl: "4%", xxxl: "6%" },
            right: { xs: "1.5rem", xl: "4%", xxl: "4%", xxxl: "6%" },
            borderTop: "0.25rem solid #000000",
          },
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "4.5fr 7.5fr" },
              gap: { xs: "2.5rem", xl: "4rem" },
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Box sx={{ mb: "2rem" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    fontSize: { xs: "2rem", md: "2.6rem", xl: "4rem", xxxl: "5rem" },
                    lineHeight: 1.08,
                    mb: "0.65rem",
                  }}
                >
                  {t("calculator-title")}
                </Typography>
                <Typography
                  sx={{
                    color: "#666",
                    fontSize: { xs: "0.95rem", xl: "1.1rem", xxxl: "1.45rem" },
                    lineHeight: 1.6,
                    maxWidth: "54ch",
                  }}
                >
                  {tStr(
                    t,
                    "calc.demo.subtitle",
                    "Preset reference scenarios for a quick operational view. Select a configuration to preview nominal output."
                  )}
                </Typography>
              </Box>

              <Box sx={{ mb: "1.5rem" }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#888",
                    mb: "0.7rem",
                  }}
                >
                  {tStr(t, "calc.demo.presets", "Reference scenarios")}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {DEMO_PRESETS.map((preset) => {
                    const isActive = preset.id === selectedPreset.id;
                    return (
                      <Button
                        key={preset.id}
                        onClick={() => setSelectedPresetId(preset.id)}
                        sx={{
                          justifyContent: "space-between",
                          textTransform: "none",
                          borderRadius: 0,
                          border: `1px solid ${isActive ? preset.color : "#ddd"}`,
                          bgcolor: isActive ? `${preset.color}10` : "#fff",
                          color: "#000",
                          px: "0.9rem",
                          py: "0.8rem",
                          "&:hover": {
                            bgcolor: `${preset.color}12`,
                            borderColor: preset.color,
                          },
                        }}
                      >
                        <Box sx={{ textAlign: "left" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.2 }}>
                            {tStr(t, preset.labelKey, preset.labelFallback)}
                          </Typography>
                          <Typography sx={{ fontSize: "0.68rem", color: "#777", mt: "0.15rem" }}>
                            {preset.configuration}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: isActive ? preset.color : "#555",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {preset.throughput}
                        </Typography>
                      </Button>
                    );
                  })}
                </Box>
              </Box>

              <Box sx={{ p: "1rem", bgcolor: "#fff", border: "1px solid #ddd", mb: "1.5rem" }}>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#888",
                    mb: "0.45rem",
                  }}
                >
                  {tStr(t, "calc.demo.reference", "Selected reference")}
                </Typography>
                <Box sx={{ display: "grid", gap: "0.4rem" }}>
                  <Typography sx={{ fontSize: "0.78rem", color: "#222" }}>
                    <strong>{tStr(t, "calc.demo.throughput", "Nominal throughput")}:</strong> {selectedPreset.throughput}
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: "#222" }}>
                    <strong>{tStr(t, "calc.demo.configuration", "Configuration")}:</strong> {selectedPreset.configuration}
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: "#222" }}>
                    <strong>{tStr(t, "calc.demo.feedstock", "Reference feedstock")}:</strong> {selectedPreset.feedstock}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Link
                  to="/calculator"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    fontWeight: 700,
                    borderBottom: "2px solid #000",
                    paddingBottom: "4px",
                  }}
                >
                  {t("open-full-calculator")}
                </Link>
              </Box>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, minmax(0, 1fr))" },
                  gap: { xs: "0.65rem", xl: "0.8rem" },
                  mb: "1.25rem",
                }}
              >
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </Box>

              <Box sx={{ border: "1px solid #ddd", bgcolor: "#fff" }}>
                <Box sx={{ px: "1rem", py: "0.8rem", borderBottom: "1px solid #eee" }}>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      color: "#666",
                    }}
                  >
                    {tStr(t, "calc.demo.compare", "Annual output by configuration")}
                  </Typography>
                </Box>

                <Box sx={{ p: "1rem" }}>
                  {DEMO_PRESETS.map((preset) => {
                    const widthPct = (preset.annualMWh / maxAnnualMWh) * 100;
                    const isActive = preset.id === selectedPreset.id;
                    return (
                      <Box key={preset.id} sx={{ mb: "0.9rem" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            mb: "0.2rem",
                          }}
                        >
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: isActive ? 700 : 600, color: "#222" }}>
                            {tStr(t, preset.labelKey, preset.labelFallback)}
                          </Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: isActive ? preset.color : "#888", fontWeight: 700 }}>
                            {preset.annualMWh.toLocaleString("en-US")} MWh
                          </Typography>
                        </Box>
                        <Box sx={{ height: 6, bgcolor: "#f0f0f0" }}>
                          <Box
                            sx={{
                              height: "100%",
                              width: `${widthPct}%`,
                              bgcolor: preset.color,
                              transition: "width 0.25s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
}
