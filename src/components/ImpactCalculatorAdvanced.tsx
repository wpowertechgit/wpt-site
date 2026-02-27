import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Slider,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
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
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaInfoCircle,
} from "react-icons/fa";
import jsPDF from "jspdf";
import figtreeRegularTtfUrl from "../assets/fonts/Figtree/Figtree-Regular.ttf?url";
import figtreeSemiBoldTtfUrl from "../assets/fonts/Figtree/Figtree-SemiBold.ttf?url";
import stackRegularTtfUrl from "../assets/fonts/Stack/StackSansText-Regular.ttf?url";
import stackBoldTtfUrl from "../assets/fonts/Stack/StackSansText-Bold.ttf?url";

// ─── Brand colours ────────────────────────────────────────────────────────────
const BRAND = {
  waste: "#8E8E8E",
  power: "#ED1C24",
  tech: "#0000FF",
};

// ─── Verified constants (sourced) ────────────────────────────────────────────
//
// UPTIME:
//   Romania has 17 official non-working public holidays per year (Romanian Labour Code / Wikipedia).
//   System operates 24/7 and halts only on those holidays.
//   Annual hours = 24 × (365 − 17) = 8,352 h  →  uptime = 348/365 = 95.3%
//
// HOUSEHOLDS:
//   EU average electricity consumption per dwelling = 3.6 MWh/year
//   Source: ODYSSEE-MURE database / Eurostat 2023 (odyssee-mure.eu)
//
// CO2 AVOIDED:
//   Diverting 1 tonne of mixed MSW from conventional uncontrolled landfill avoids ~0.30 t CO2eq
//   (primarily avoided landfill methane). Conservative lower-bound figure.
//   Source: Manfredi et al. (2009), Waste Management & Research — IPCC Tier II landfill model.
//
// TREES:
//   1 tonne CO2 ≈ sequestration of 45 mature trees per year.
//   Source: US EPA Greenhouse Gas Equivalencies Calculator (2024).
//
// CARS:
//   EU average new passenger car: 107 g CO2/km (EEA 2023, WLTP).
//   Assumed average annual mileage: 12,000 km/year.
//   → 107 × 12,000 / 1,000,000 = 1.284 t CO2/car/year (rounded to 1.28).
//   Source: European Environment Agency, "CO2 performance of new passenger cars", 2023.

const CONSTANTS = {
  romaniaHolidayDays: 17,
  annualHours: 24 * (365 - 17),           // 8,352 h/year
  uptimePct: (((365 - 17) / 365) * 100).toFixed(1), // "95.3"

  mwhPerHousehold: 3.6,                   // EU avg MWh/dwelling/year (Eurostat/ODYSSEE-MURE 2023)
  co2PerTonneAvoided: 0.30,              // t CO2eq/tonne MSW diverted from landfill (IPCC Tier II)
  treesPerTonneCO2: 45,                   // trees equivalent per tonne CO2/year (EPA 2024)
  co2PerCarYear: 1.284,                   // t CO2/average EU car/year (EEA 2023 + 12,000 km)
};

const PDF_LOGO_URL = "/wpt logo-01.png";
const PDF_LOGO_WIDTH_PX = 1313;
const PDF_LOGO_HEIGHT_PX = 254;

let pdfFontDataPromise: Promise<Record<string, string>> | null = null;
let pdfLogoDataUrlPromise: Promise<string> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

async function fetchAssetAsBase64(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load asset: ${url}`);
  }

  return arrayBufferToBase64(await response.arrayBuffer());
}

async function getPdfFontData() {
  if (!pdfFontDataPromise) {
    pdfFontDataPromise = Promise.all([
      fetchAssetAsBase64(figtreeRegularTtfUrl),
      fetchAssetAsBase64(figtreeSemiBoldTtfUrl),
      fetchAssetAsBase64(stackRegularTtfUrl),
      fetchAssetAsBase64(stackBoldTtfUrl),
    ]).then(([figtreeRegular, figtreeSemiBold, stackRegular, stackBold]) => ({
      figtreeRegular,
      figtreeSemiBold,
      stackRegular,
      stackBold,
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
      const response = await fetch(PDF_LOGO_URL);
      if (!response.ok) {
        throw new Error(`Failed to load logo: ${PDF_LOGO_URL}`);
      }

      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }

          reject(new Error("Failed to convert PNG logo to data URL"));
        };
        reader.onerror = () => reject(new Error("Failed to read PNG logo"));
        reader.readAsDataURL(blob);
      });
    })();
  }

  return pdfLogoDataUrlPromise;
}

// ─── Model specs ──────────────────────────────────────────────────────────────
const MODELS = {
  WP1000: {
    label: "WP1000 – 1 t/h",
    shortLabel: "WP1000",
    tonsPerHour: 1.0,
    generators: 5,
    generatorType: "5× 350 kVA ADG 350",
    mwhPerTonBase: 1.0,  // 1 t/h → 1 MWh at 20% humidity baseline
  },
  WP1500: {
    label: "WP1500 – 1.5 t/h",
    shortLabel: "WP1500",
    tonsPerHour: 1.5,
    generators: 5,
    generatorType: "5× 350 kVA ADG 350",
    mwhPerTonBase: 1.0,  // 1.5 t/h → 1.5 MWh at 20% humidity baseline
  },
};

// ─── ImpactCard ───────────────────────────────────────────────────────────────
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
      <Box sx={{ display: "flex", alignItems: "center", mb: "0.75rem" }}>
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
      <Typography sx={{ fontSize: { xs: "0.78rem", xl: "0.9rem", xxxl: "1rem" }, opacity: 0.8 }}>
        {sub}
      </Typography>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImpactCalculatorAdvanced() {
  const { t } = useTranslation();

  const [modelKey, setModelKey] = useState<"WP1000" | "WP1500">("WP1500");
  const [units, setUnits] = useState<number>(2);
  const [humidityPct, setHumidityPct] = useState<number>(20);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const model = MODELS[modelKey];

  // ── Calculations ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const { annualHours, mwhPerHousehold, co2PerTonneAvoided, treesPerTonneCO2, co2PerCarYear } = CONSTANTS;

    // Humidity efficiency: 20% is baseline. Higher → less output, lower → more output.
    const humidityFactor = (100 - humidityPct) / (100 - 20);

    const effectiveTphPerUnit = model.tonsPerHour * humidityFactor;
    const tonsPerUnitYear = effectiveTphPerUnit * annualHours;
    const mwhPerUnit = tonsPerUnitYear * model.mwhPerTonBase;

    const co2PerUnit = tonsPerUnitYear * co2PerTonneAvoided;
    const treesPerUnit = Math.floor(co2PerUnit * treesPerTonneCO2);
    const carsPerUnit = Math.floor(co2PerUnit / co2PerCarYear);
    const householdsPerUnit = Math.floor(mwhPerUnit / mwhPerHousehold);

    const fleetMWh = Math.round(mwhPerUnit * units);
    const fleetCO2 = Math.round(co2PerUnit * units);
    const fleetTrees = treesPerUnit * units;
    const fleetCars = carsPerUnit * units;
    const fleetHouseholds = householdsPerUnit * units;
    const fleetTons = Math.round(tonsPerUnitYear * units);

    return {
      effectiveTph: effectiveTphPerUnit.toFixed(2),
      humidityFactor: humidityFactor.toFixed(3),

      fleetMWhStr: fleetMWh.toLocaleString("en-US"),
      fleetCO2Str: fleetCO2.toLocaleString("en-US"),
      fleetTreesStr: fleetTrees.toLocaleString("en-US"),
      fleetCarsStr: fleetCars.toLocaleString("en-US"),
      fleetHouseholdsStr: fleetHouseholds.toLocaleString("en-US"),
      fleetTonsStr: fleetTons.toLocaleString("en-US"),

      fleetMWh,
      fleetCO2,
      fleetTrees,
      fleetCars,
      fleetHouseholds,
      fleetTons,
      annualHours,
    };
  }, [model, units, humidityPct]);

  // ── Metric cards ─────────────────────────────────────────────────────────────
  const metrics: ImpactCardProps[] = [
    {
      value: stats.fleetMWhStr,
      label: "MWh / Year",
      sub: `Energy generated (${units} unit${units > 1 ? "s" : ""})`,
      color: BRAND.power,
      icon: FaBolt,
    },
    {
      value: stats.fleetHouseholdsStr,
      label: "Households",
      sub: "Powered/yr (EU avg 3.6 MWh)",
      color: BRAND.power,
      icon: FaIndustry,
    },
    {
      value: `${stats.fleetCO2Str} t`,
      label: "CO₂ Avoided",
      sub: "Landfill methane not emitted",
      color: BRAND.waste,
      icon: FaLeaf,
    },
    {
      value: stats.fleetTreesStr,
      label: "Trees Equiv.",
      sub: "CO₂ sequestration equivalent",
      color: BRAND.waste,
      icon: FaTree,
    },
    {
      value: stats.fleetCarsStr,
      label: "Cars Off Road",
      sub: "Annual equiv. (EEA 2023)",
      color: BRAND.waste,
      icon: FaCarSide,
    },
    {
      value: "97.4%",
      label: "Waste Recovery",
      sub: "Material diversion rate",
      color: BRAND.waste,
      icon: FaRecycle,
    },
    {
      value: `${CONSTANTS.uptimePct}%`,
      label: "System Uptime",
      sub: `${stats.annualHours} h/yr · 17 RO holidays`,
      color: BRAND.tech,
      icon: FaServer,
    },
    {
      value: "A+",
      label: "Compliance",
      sub: "Audit readiness score",
      color: BRAND.tech,
      icon: FaShieldAlt,
    },
    {
      value: "24/7",
      label: "Grid Response",
      sub: "Continuous load support",
      color: BRAND.tech,
      icon: FaChartLine,
    },
  ];

  // ── PDF Export ───────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [297, 500] });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 0;
    let titleFont = "helvetica";
    let bodyFont = "helvetica";

    try {
      await registerPdfFonts(doc);
      titleFont = "Stack Sans Headline";
      bodyFont = "Figtree";
    } catch (error) {
      console.error("Failed to register PDF fonts", error);
    }

    // ── Header ──
    try {
      const logoDataUrl = await getPdfLogoDataUrl();
      const logoHeight = 9;
      const logoWidth = (logoHeight * PDF_LOGO_WIDTH_PX) / PDF_LOGO_HEIGHT_PX;
      doc.addImage(logoDataUrl, "PNG", margin, 12, logoWidth, logoHeight);
    } catch (error) {
      console.error("Failed to render PDF logo", error);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont(titleFont, "bold");
      doc.text("WASTE POWER TECH", margin, 20);
    }

    // ── Header separator line ──
    y = 30;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageW - margin, y);

    // ── Title ──
    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(titleFont, "bold");
    doc.text("Environmental Impact Estimate Report", pageW / 2, y, { align: "center" });

    y += 7;
    doc.setFontSize(9);
    doc.setFont(bodyFont, "normal");
    doc.setTextColor(90, 90, 90);
    doc.text(
      `Model: ${model.label}  ·  Units: ${units}  ·  Humidity loss: ${humidityPct}%  ·  Date: ${new Date().toLocaleDateString("en-GB")}`,
      pageW / 2,
      y,
      { align: "center" }
    );

    y += 5;
    doc.setFontSize(8);
    doc.setFont(bodyFont, "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Estimates based on the Cluj – CMID project reference installation.",
      pageW / 2,
      y,
      { align: "center" }
    );

    y += 7;
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);

    // ── Input parameters ──
    y += 8;
    doc.setFontSize(11.5);
    doc.setFont(titleFont, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Input Parameters", margin, y);

    const params: [string, string][] = [
      ["Model", model.label],
      ["Number of units", `${units}`],
      ["Nominal throughput (per unit)", `${model.tonsPerHour} t/h`],
      ["Humidity / moisture loss", `${humidityPct}%   (baseline: 20% – Cluj CMID)`],
      ["Humidity efficiency factor", `×${stats.humidityFactor}`],
      ["Effective throughput (humidity-adjusted)", `${stats.effectiveTph} t/h per unit`],
      ["Generators per unit", `${model.generators}× ADG 350 (350 kVA each)`],
      ["Annual operating hours", `${stats.annualHours} h  (24/7 minus 17 holiday days)`],
      ["System uptime", `${CONSTANTS.uptimePct}%  of year`],
    ];

    y += 6;
    doc.setFontSize(8.8);
    params.forEach(([k, v], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin - 2, y - 4, pageW - margin * 2 + 4, 6.5, "F");
      }
      doc.setFont(bodyFont, "bold");
      doc.setTextColor(70, 70, 70);
      doc.text(`${k}:`, margin, y);
      doc.setFont(bodyFont, "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(v, pageW - margin, y, { align: "right" });
      y += 7;
    });

    // ── Results ──
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 7;

    doc.setFontSize(11.5);
    doc.setFont(titleFont, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Fleet Impact Results – Annual  (${units}× ${model.shortLabel})`, margin, y);
    y += 6;

    type ResultRow = [string, string, string];
    const results: ResultRow[] = [
      ["Total Energy Generated", `${stats.fleetMWh.toLocaleString()} MWh`, ""],
      [
        "EU Households Powered",
        `${stats.fleetHouseholds.toLocaleString()}`,
        "EU avg 3.6 MWh/dwelling/year — ODYSSEE-MURE / Eurostat 2023",
      ],
      [
        "CO2 Emissions Avoided",
        `${stats.fleetCO2.toLocaleString()} t CO2eq`,
        "0.30 t CO2eq/tonne MSW — IPCC Tier II conventional landfill (Manfredi et al. 2009)",
      ],
      [
        "Equivalent Trees Planted",
        `${stats.fleetTrees.toLocaleString()}`,
        "45 trees/tonne CO2/year — US EPA Equivalencies Calculator 2024",
      ],
      [
        "Cars Removed from Roads",
        `${stats.fleetCars.toLocaleString()}`,
        "107 g CO2/km x 12,000 km/yr = 1.28 t CO2/car — EEA 2023 (WLTP)",
      ],
      ["Waste Diverted from Landfill", `${stats.fleetTons.toLocaleString()} t`, ""],
      ["Waste Recovery Rate", "97.4%", ""],
      ["System Uptime", `${CONSTANTS.uptimePct}%  (${stats.annualHours} h/yr)`, "17 Romanian official public holidays — Romanian Labour Code"],
    ];

    doc.setFontSize(8.8);
    results.forEach(([k, v, note], i) => {
      const rowH = note ? 11 : 7;
      if (i % 2 === 0) {
        doc.setFillColor(244, 244, 244);
        doc.rect(margin - 2, y - 4.5, pageW - margin * 2 + 4, rowH, "F");
      }
      doc.setFont(bodyFont, "bold");
      doc.setTextColor(50, 50, 50);
      doc.text(`${k}:`, margin, y);
      doc.setFont(bodyFont, "bold");
      doc.setTextColor(0, 0, 200);
      doc.text(v, pageW - margin, y, { align: "right" });
      if (note) {
        y += 4.5;
        doc.setFont(bodyFont, "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(155, 155, 155);
        doc.text(note, margin + 2, y);
        doc.setFontSize(8.8);
      }
      y += 7.5;
    });

    // ── Sources ──
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    doc.setFontSize(10.5);
    doc.setFont(titleFont, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Data Sources & Methodology", margin, y);
    y += 5;

    const sources = [
      "UPTIME: Romania has 17 official non-working public holidays/year (Romanian Labour Code; Wikipedia). System operates 24/7, halting only on these days. Annual hours = 24 x (365 - 17) = 8,352 h. Uptime = 95.3%.",
      "HOUSEHOLDS: EU average electricity consumption per dwelling = 3.6 MWh/year. Source: ODYSSEE-MURE database / Eurostat, 2023.",
      "CO2 AVOIDED: 0.30 t CO2eq per tonne of MSW diverted from conventional (uncontrolled) landfill, primarily avoided landfill methane. Conservative lower bound. Source: Manfredi, Scharff, Tonini & Christensen (2009), Waste Management & Research; IPCC Tier II model.",
      "TREES: 45 mature trees sequester approximately 1 tonne CO2/year. Source: US EPA Greenhouse Gas Equivalencies Calculator (2024).",
      "CARS: EU average new car emits 107 g CO2/km (EEA 2023, WLTP). Assumed 12,000 km/year average. Result: 1.28 t CO2/car/year. Source: European Environment Agency.",
      "HUMIDITY FACTOR: (100 - moisture%) / (100 - 20%). Baseline 20% reflects Cluj-CMID operating conditions where 1.5 t/h input yields 1.5 MWh output.",
    ];

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(80, 80, 80);
    sources.forEach((s) => {
      const lines = doc.splitTextToSize(`• ${s}`, pageW - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 4.2 + 1.5;
    });

    // ── Disclaimer ──
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    doc.setFontSize(10.5);
    doc.setFont(titleFont, "bold");
    doc.setTextColor(180, 0, 0);
    doc.text("Disclaimer", margin, y);
    y += 5;

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(110, 110, 110);
    const disclaimer =
      "All figures are approximate estimates based on the Cluj – CMID reference installation " +
      "(2x WP1500 units, 70 t/day, 25,550 t/year, 24/7 operation with maintenance only on Romania's 17 official public holidays). " +
      "Actual energy output may vary significantly depending on waste composition, calorific value, and moisture/humidity content of the input waste. " +
      "Higher humidity results in proportional energy yield reduction. " +
      "CO2 avoidance figures assume conventional uncontrolled landfilling as the counterfactual baseline. " +
      "This document does not constitute a binding commercial proposal.";
    const splitDis = doc.splitTextToSize(disclaimer, pageW - margin * 2);
    doc.text(splitDis, margin, y);

    doc.save(
      `WPT-Impact-${modelKey}-${units}units-H${humidityPct}pct-${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
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
              gridTemplateColumns: { xs: "1fr", lg: "5fr 7fr" },
              gap: { xs: "3rem", xl: "5rem" },
              alignItems: "flex-start",
            }}
          >
            {/* ── Left column ──────────────────────────────────────── */}
            <Box>
              {/* Logo + title */}
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
                  alt="Waste Powertech logo"
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
                  alt="Waste Powertech logo"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    width: { sm: "85rem", lg: "10rem", xl: "15rem", xxl: "15rem", xxxl: "20rem" },
                    height: "auto",
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    mb: 0,
                    fontSize: { xs: "2.5rem", md: "3rem", xl: "4.5rem", xxl: "4.5rem", xxxl: "6rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {t("calculator-title")}
                </Typography>
              </Box>

              {/* ── Model selector ── */}
              <Box sx={{ mb: "2rem" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: "0.75rem",
                    fontSize: { xs: "0.82rem", xl: "0.95rem" },
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#555",
                  }}
                >
                  Model
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={modelKey}
                  onChange={(_, v) => v && setModelKey(v)}
                  sx={{
                    "& .MuiToggleButton-root": {
                      border: "2px solid #000",
                      borderRadius: 0,
                      fontWeight: 700,
                      fontSize: { xs: "0.82rem", xl: "0.92rem" },
                      px: "1.25rem",
                      py: "0.5rem",
                      "&.Mui-selected": {
                        bgcolor: "#0000FF",
                        color: "#fff",
                        "&:hover": { bgcolor: "#0000cc" },
                      },
                    },
                  }}
                >
                  <ToggleButton value="WP1000">WP1000 – 1 t/h</ToggleButton>
                  <ToggleButton value="WP1500">WP1500 – 1.5 t/h</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* ── Units slider ── */}
              <Box sx={{ mb: "2.5rem" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: "0.75rem",
                    fontSize: { xs: "0.82rem", xl: "0.95rem" },
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#555",
                  }}
                >
                  Number of units
                </Typography>
                <Typography sx={{ mb: "0.75rem", fontWeight: 600, fontSize: { xs: "1.25rem", xl: "1.75rem" } }}>
                  {units}× {model.shortLabel}
                </Typography>
                <Slider
                  value={units}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  onChange={(_, v) => setUnits(Array.isArray(v) ? v[0] : v)}
                  sx={{
                    color: "#0000FF",
                    height: { xs: 8, xl: 16 },
                    "& .MuiSlider-thumb": {
                      width: { xs: 24, xl: 42 },
                      height: { xs: 24, xl: 42 },
                      backgroundColor: "#0000FF",
                      "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 15px rgba(0,0,255,0.16)" },
                    },
                    "& .MuiSlider-rail": { opacity: 0.2, backgroundColor: "#000" },
                  }}
                />
                <Typography sx={{ mt: "0.5rem", color: "#666", fontSize: { xs: "0.83rem", xl: "0.97rem" } }}>
                  {model.generators * units} generators total &nbsp;·&nbsp; {model.generatorType} per unit
                </Typography>
              </Box>

              {/* ── Advanced options ── */}
              <Box sx={{ mb: "1.25rem", border: "1px solid #ddd", bgcolor: "#fff" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: "1rem",
                    py: "0.75rem",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setAdvancedOpen((o) => !o)}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.82rem", xl: "0.95rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                    }}
                  >
                    Advanced options
                  </Typography>
                  {advancedOpen ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                </Box>
                <Collapse in={advancedOpen}>
                  <Box sx={{ px: "1rem", pb: "1.25rem" }}>
                    <Typography sx={{ fontWeight: 700, mb: "0.35rem", fontSize: "0.88rem" }}>
                      Waste humidity / moisture loss:{" "}
                      <span style={{ color: "#ED1C24" }}>{humidityPct}%</span>
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "0.75rem", mb: "1rem", lineHeight: 1.6 }}>
                      Cluj–CMID baseline is <strong>20% moisture</strong>, at which 1.5 t/h input yields
                      1.5 MWh. Wetter waste reduces output; drier waste increases it.
                      <br />
                      Current efficiency factor:{" "}
                      <strong style={{ color: "#0000FF" }}>×{stats.humidityFactor}</strong> relative to
                      baseline.
                    </Typography>
                    <Slider
                      value={humidityPct}
                      min={5}
                      max={55}
                      step={1}
                      onChange={(_, v) => setHumidityPct(Array.isArray(v) ? v[0] : v)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(v) => `${v}%`}
                      sx={{
                        color: "#ED1C24",
                        "& .MuiSlider-thumb": { backgroundColor: "#ED1C24" },
                        "& .MuiSlider-rail": { opacity: 0.2, backgroundColor: "#000" },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "0.25rem" }}>
                      <Typography sx={{ fontSize: "0.69rem", color: "#bbb" }}>5% – Very dry</Typography>
                      <Typography sx={{ fontSize: "0.69rem", color: "#bbb" }}>55% – Very wet</Typography>
                    </Box>
                  </Box>
                </Collapse>
              </Box>

              {/* ── Export PDF (Full Analysis button removed — this IS the full analysis page) ── */}
              <Box sx={{ mb: "1.25rem" }}>
                <Button
                  onClick={handleExportPDF}
                  startIcon={<FaFilePdf />}
                  sx={{
                    bgcolor: "#000",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 0,
                    px: "1.5rem",
                    py: "0.6rem",
                    fontSize: { xs: "0.85rem", xl: "1rem" },
                    textTransform: "none",
                    "&:hover": { bgcolor: "#0000FF" },
                  }}
                >
                  Export PDF Report
                </Button>
              </Box>

              {/* ── Disclaimer ── */}
              <Box sx={{ border: "1px solid #ddd", bgcolor: "#fff" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    px: "1rem",
                    py: "0.75rem",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setDisclaimerOpen((o) => !o)}
                >
                  <FaInfoCircle size={13} color="#8E8E8E" />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.79rem", color: "#555", flex: 1 }}>
                    Estimates based on the Cluj – CMID project
                  </Typography>
                  {disclaimerOpen ? (
                    <FaChevronUp size={11} color="#bbb" />
                  ) : (
                    <FaChevronDown size={11} color="#bbb" />
                  )}
                </Box>
                <Collapse in={disclaimerOpen}>
                  <Box sx={{ px: "1rem", pb: "1rem", borderTop: "1px solid #eee" }}>
                    <Typography sx={{ fontSize: "0.76rem", color: "#555", lineHeight: 1.72, mt: "0.75rem" }}>
                      All figures are <strong>approximate estimates</strong> based on the{" "}
                      <strong>Cluj – CMID reference installation</strong>: 2× WP1500 units, 70 t/day
                      capacity, 25,550 t/year, continuous 24/7 operation. Maintenance downtime is
                      scheduled only on Romania's <strong>17 official public holidays</strong> per year
                      (Romanian Labour Code), giving a verified uptime of{" "}
                      <strong>{CONSTANTS.uptimePct}%</strong> ({CONSTANTS.annualHours} h/year).
                    </Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: "#555", lineHeight: 1.72, mt: "0.5rem" }}>
                      Each unit is powered by <strong>5× 350 kVA ADG 350 generators</strong> (10 total
                      for the Cluj installation).
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.76rem",
                        color: "#ED1C24",
                        fontWeight: 700,
                        lineHeight: 1.7,
                        mt: "0.5rem",
                      }}
                    >
                      ⚠ Energy output is directly affected by the moisture content of input waste. Higher
                      humidity causes proportional energy yield reduction. Model this using Advanced
                      Options above.
                    </Typography>

                    {/* Source citations */}
                    <Box
                      sx={{
                        mt: "0.75rem",
                        pt: "0.75rem",
                        borderTop: "1px solid #eee",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.3rem",
                      }}
                    >
                      {[
                        ["Uptime", "17 RO public holidays/year · Romanian Labour Code"],
                        ["Households", "EU avg 3.6 MWh/dwelling/year · ODYSSEE-MURE / Eurostat 2023"],
                        [
                          "CO₂ avoided",
                          "0.30 t CO2eq/tonne MSW from landfill · IPCC Tier II (Manfredi et al. 2009)",
                        ],
                        ["Cars removed", "107 g/km × 12,000 km/yr = 1.28 t CO2/car · EEA 2023 (WLTP)"],
                        ["Trees equiv.", "45 trees/tonne CO2/yr · US EPA equivalency calculator 2024"],
                      ].map(([label, src]) => (
                        <Typography key={label} sx={{ fontSize: "0.71rem", color: "#888", lineHeight: 1.5 }}>
                          <strong style={{ color: "#444" }}>{label}:</strong> {src}
                        </Typography>
                      ))}
                    </Box>

                    <Typography sx={{ fontSize: "0.69rem", color: "#ccc", mt: "0.6rem", lineHeight: 1.5 }}>
                      This calculator does not constitute a binding commercial proposal. &nbsp;
                      Waste Powertech SRL · wpowertech.ro
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            </Box>

            {/* ── Right column: metric cards ─────────────────────── */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", lg: "1fr 1fr 1fr" },
                gap: { xs: "0.75rem", xl: "1rem" },
              }}
            >
              {metrics.map((m) => (
                <ImpactCard key={m.label} {...m} />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
}
