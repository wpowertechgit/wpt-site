import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaBolt,
  FaCarSide,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaFilePdf,
  FaFlask,
  FaInfoCircle,
  FaIndustry,
  FaLeaf,
  FaPlus,
  FaServer,
  FaTree,
} from "react-icons/fa";
import ActiveWasteRow from "./impactCalculator/ActiveWasteRow";
import CustomMixBuilder from "./impactCalculator/CustomMixBuilder";
import FloatInput from "./impactCalculator/FloatInput";
import ImpactCard, { type ImpactCardProps } from "./impactCalculator/ImpactCard";
import { getWasteLabel, tStr } from "./impactCalculator/i18n";
import { BRAND, CONSTANTS, ncvAr, type WasteInput, WASTE_TYPES, type WasteType } from "./impactCalculator/model";
import { exportImpactCalculatorPdf } from "./impactCalculator/report";
import WasteInfoDialog from "./impactCalculator/WasteInfoDialog";
import WasteSelectorOverlay from "./impactCalculator/WasteSelectorOverlay";

export default function ImpactCalculatorAdvanced() {
  const { t } = useTranslation();

  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [customTypes, setCustomTypes] = useState<WasteType[]>([]);
  const [wasteInputs, setWasteInputs] = useState<Record<string, WasteInput>>(
    Object.fromEntries(WASTE_TYPES.map((wasteType) => [wasteType.key, { tonnes: 0, moisture: wasteType.defaultMoisture }]))
  );
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
    setActiveKeys((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  }, []);

  const removeWasteKey = useCallback((key: string) => {
    setActiveKeys((prev) => prev.filter((item) => item !== key));
    setWasteInputs((prev) => ({ ...prev, [key]: { ...prev[key], tonnes: 0 } }));
  }, []);

  const saveCustomMix = useCallback((mix: WasteType) => {
    setCustomTypes((prev) => [...prev, mix]);
    setWasteInputs((prev) => ({ ...prev, [mix.key]: { tonnes: 0, moisture: mix.defaultMoisture } }));
    setCustomBuilderOpen(false);
  }, []);

  const stats = useMemo(() => {
    const {
      annualHours,
      mwhPerHousehold,
      co2PerTonneAvoided,
      treesPerTonneCO2,
      co2PerCarYear,
      generatorEfficiency,
      MJ_PER_MWH,
    } = CONSTANTS;

    let totalTonnesPerHour = 0;
    let totalEnergyMJPerHour = 0;
    const breakdown: {
      label: string;
      key: string;
      tonnes: number;
      moisture: number;
      ncvArVal: number;
      energyMJ: number;
      image: string;
    }[] = [];

    activeKeys.forEach((key) => {
      const wasteType = allTypes.find((item) => item.key === key);
      if (!wasteType) {
        return;
      }

      const { tonnes, moisture } = wasteInputs[key] ?? { tonnes: 0, moisture: wasteType.defaultMoisture };
      if (tonnes <= 0) {
        return;
      }

      const ncvArVal = ncvAr(wasteType.hhvDry, moisture);
      const energyMJ = tonnes * 1000 * ncvArVal;

      totalTonnesPerHour += tonnes;
      totalEnergyMJPerHour += energyMJ;
      breakdown.push({
        label: getWasteLabel(t, wasteType),
        key,
        tonnes,
        moisture,
        ncvArVal,
        energyMJ,
        image: wasteType.image,
      });
    });

    const mwhElectricPerHour = (totalEnergyMJPerHour / MJ_PER_MWH) * generatorEfficiency;
    const annualMWh = Math.round(mwhElectricPerHour * annualHours);
    const monthlyMWh = Math.round(annualMWh / 12);
    const dailyMWh = Math.round(annualMWh / 365);
    const annualTons = Math.round(totalTonnesPerHour * annualHours);
    const co2Annual = Math.round(annualTons * co2PerTonneAvoided);
    const householdsAnnual = Math.floor(annualMWh / mwhPerHousehold);
    const treesAnnual = Math.floor(co2Annual * treesPerTonneCO2);
    const carsAnnual = Math.floor(co2Annual / co2PerCarYear);

    let hoursToProcess: number | null = null;
    if (totalAmountMode && totalAmountValue > 0 && totalTonnesPerHour > 0) {
      const totalTonnes = totalAmountUnit === "t" ? totalAmountValue : totalAmountValue / 1000;
      hoursToProcess = totalTonnes / totalTonnesPerHour;
    }

    return {
      totalTonnesPerHour,
      totalEnergyMJPerHour: Math.round(totalEnergyMJPerHour),
      mwhElectricPerHour: mwhElectricPerHour.toFixed(3),
      annualMWhStr: annualMWh.toLocaleString("en-US"),
      monthlyMWhStr: monthlyMWh.toLocaleString("en-US"),
      dailyMWhStr: dailyMWh.toLocaleString("en-US"),
      annualTonsStr: annualTons.toLocaleString("en-US"),
      co2AnnualStr: co2Annual.toLocaleString("en-US"),
      householdsAnnualStr: householdsAnnual.toLocaleString("en-US"),
      treesAnnualStr: treesAnnual.toLocaleString("en-US"),
      carsAnnualStr: carsAnnual.toLocaleString("en-US"),
      hoursToProcess,
      breakdown,
      hasInput: totalTonnesPerHour > 0,
      annualHours,
    };
  }, [activeKeys, allTypes, t, totalAmountMode, totalAmountUnit, totalAmountValue, wasteInputs]);

  const ncvArMap = useMemo(() => {
    const map: Record<string, number> = {};
    allTypes.forEach((wasteType) => {
      const moisture = wasteInputs[wasteType.key]?.moisture ?? wasteType.defaultMoisture;
      map[wasteType.key] = ncvAr(wasteType.hhvDry, moisture);
    });
    return map;
  }, [allTypes, wasteInputs]);

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

  const hoursCard: ImpactCardProps | null = totalAmountMode && stats.hoursToProcess !== null
    ? {
      value: stats.hoursToProcess < 1 ? `${Math.round(stats.hoursToProcess * 60)} min` : `${stats.hoursToProcess.toFixed(1)} h`,
      label: tStr(t, "calc.metric.processingTime", "Processing Time"),
      sub: tStr(t, "calc.metric.processingTimeSub", "To process total amount"),
      color: "#1a1a1a",
      icon: FaClock,
      highlight: true,
    }
    : null;

  const handleExportPDF = useCallback(async () => {
    await exportImpactCalculatorPdf({
      stats,
      allTypes,
      totalAmountUnit,
      totalAmountValue,
    });
  }, [allTypes, stats, totalAmountUnit, totalAmountValue]);

  return (
    <>
      <WasteSelectorOverlay
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        activeKeys={new Set(activeKeys)}
        onToggle={toggleWasteKey}
        onOpenCustomBuilder={() => {
          setSelectorOpen(false);
          setCustomBuilderOpen(true);
        }}
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

      <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
        <Box
          id="calculator"
          sx={{
            position: "relative",
            py: { xs: "4rem", xl: "8rem", xxl: "9rem", xxxl: "10rem" },
            bgcolor: "#f9f9f9",
            borderLeft: { xs: "0.4rem solid #0000FF", xl: "1.25rem solid #0000FF", xxl: "1.5rem solid #0000FF", xxxl: "1.75rem solid #0000FF" },
            px: { xs: "1.25rem", xl: "4%", xxl: "3.5%", xxxl: "5%" },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: { xs: "1.25rem", xl: "4%", xxl: "3.5%", xxxl: "5%" },
              right: { xs: "1.25rem", xl: "4%", xxl: "3.5%", xxxl: "5%" },
              borderTop: "0.2rem solid #000",
            },
          }}
        >
          <Container maxWidth={false}>
            <Box sx={{ mb: { xs: "2.5rem", xl: "4rem", xxl: "4.75rem", xxxl: "5.5rem" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1.25rem", mb: "0.6rem", flexWrap: "wrap" }}>
                <Box component="img" src="/wpt-black-compact-logo.svg" alt="Waste Powertech logo" sx={{ width: { xs: "6.5rem", xl: "10rem", xxl: "13rem", xxxl: "15.5rem" }, height: "auto" }} />
                <Typography variant="h2" sx={{ fontFamily: "Stack Sans Headline, sans-serif", fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.5rem", xl: "3.75rem", xxl: "4.4rem", xxxl: "5.4rem" }, lineHeight: 1.1, mb: 0 }}>
                  {tStr(t, "calculator-title", "Impact Calculator")}
                </Typography>
              </Box>
              <Typography sx={{ color: "#999", fontSize: { xs: "0.82rem", xl: "0.95rem", xxl: "1.08rem", xxxl: "1.22rem" }, maxWidth: { xs: "55ch", xxl: "64ch", xxxl: "72ch" } }}>
                {tStr(t, "calc.subtitle", "Build your waste mix — each type uses the")}{" "}
                <strong style={{ color: "#333" }}>EN 14918</strong>{" "}
                {tStr(t, "calc.subtitle2", "moisture correction formula for real energy yield.")}
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "5fr 7fr", xxl: "5fr 7.5fr", xxxl: "5fr 8fr" }, gap: { xs: "2.5rem", xl: "4rem", xxl: "4.75rem", xxxl: "5.5rem" }, alignItems: "flex-start" }}>
              <Box>
                <Box sx={{ mb: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Button
                    onClick={() => setSelectorOpen(true)}
                    startIcon={<FaPlus size={12} />}
                    sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "1.4rem", xxl: "2rem", xxxl: "2.45rem" }, py: { xs: "0.65rem", xxl: "0.95rem", xxxl: "1.15rem" }, fontSize: { xs: "0.85rem", xl: "0.95rem", xxl: "1.2rem", xxxl: "1.42rem" }, textTransform: "none", "& .MuiButton-startIcon svg": { width: { xxl: "1rem", xxxl: "1.2rem" }, height: { xxl: "1rem", xxxl: "1.2rem" } }, "&:hover": { bgcolor: "#0000FF" }, transition: "background-color 0.15s" }}
                  >
                    {tStr(t, "calc.addWaste", "Choose Waste Types")}
                  </Button>
                  {activeKeys.length > 0 && (
                    <Typography sx={{ fontSize: { xs: "0.75rem", xxl: "0.85rem", xxxl: "1rem" }, color: "#aaa" }}>
                      {activeKeys.length} {tStr(t, "calc.typesSelected", "type(s) selected")}
                    </Typography>
                  )}
                </Box>

                {activeKeys.length === 0 ? (
                  <Box sx={{ p: "2rem 1.5rem", border: "2px dashed #ddd", bgcolor: "#fff", textAlign: "center", mb: "1.25rem" }}>
                    <Typography sx={{ color: "#ccc", fontSize: { xs: "0.85rem", xxl: "0.98rem", xxxl: "1.12rem" }, mb: "0.4rem" }}>{tStr(t, "calc.emptyTitle", "No waste types selected yet")}</Typography>
                    <Typography sx={{ color: "#ddd", fontSize: { xs: "0.75rem", xxl: "0.86rem", xxxl: "1rem" } }}>{tStr(t, "calc.emptyHint", 'Click "Choose Waste Types" to begin')}</Typography>
                  </Box>
                ) : (
                  <Box sx={{ mb: "1.25rem" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.7rem", xxl: "0.8rem", xxxl: "0.94rem" }, textTransform: "uppercase", letterSpacing: "0.1em", color: "#bbb", mb: "0.55rem" }}>
                      {tStr(t, "calc.mixLabel", "Waste mix — throughput & moisture")}
                    </Typography>
                    <AnimatePresence mode="popLayout">
                      {activeKeys.map((key) => {
                        const wasteType = allTypes.find((item) => item.key === key);
                        if (!wasteType) {
                          return null;
                        }

                        return (
                          <ActiveWasteRow
                            key={key}
                            wasteType={wasteType}
                            tonnes={wasteInputs[key]?.tonnes ?? 0}
                            moisture={wasteInputs[key]?.moisture ?? wasteType.defaultMoisture}
                            ncvArVal={ncvArMap[key] ?? 0}
                            onTonnesChange={(value) => setWasteInputs((prev) => ({ ...prev, [key]: { ...prev[key], tonnes: value } }))}
                            onMoistureChange={(value) => setWasteInputs((prev) => ({ ...prev, [key]: { ...prev[key], moisture: value } }))}
                            onRemove={() => removeWasteKey(key)}
                            onInfoClick={() => setDialogWaste(wasteType)}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </Box>
                )}

                {stats.hasInput && (
                  <Box sx={{ mb: "1.25rem", p: { xs: "1rem 1.25rem", xxl: "1.2rem 1.5rem", xxxl: "1.4rem 1.8rem" }, bgcolor: "#000", color: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: { xs: "0.75rem", xxl: "1rem", xxxl: "1.2rem" } }}>
                    {[
                      [tStr(t, "calc.summary.totalInput", "Total input"), `${stats.totalTonnesPerHour.toFixed(2)} ${tStr(t, "calc.summary.tph", "tonnes of waste/hour")}`],
                      [tStr(t, "calc.summary.thermal", "Thermal"), `${(stats.totalEnergyMJPerHour / 1000).toFixed(2)} GJ/h`],
                      [tStr(t, "calc.summary.electrical", "Electrical"), `${stats.mwhElectricPerHour} MWh/h`],
                    ].map(([label, value]) => (
                      <Box key={label as string}>
                        <Typography sx={{ fontSize: { xs: "0.59rem", xxl: "0.68rem", xxxl: "0.8rem" }, textTransform: "uppercase", letterSpacing: "0.06em", mb: "0.1rem" }}>{label}</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.85rem", xl: "0.95rem", xxl: "1.08rem", xxxl: "1.24rem" }, lineHeight: 1.2 }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                <Box sx={{ mb: "1rem", border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: "1rem", xxl: "1.25rem", xxxl: "1.5rem" }, py: { xs: "0.65rem", xxl: "0.85rem", xxxl: "1rem" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <FaClock size={11} color="#888" />
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.73rem", xxl: "0.84rem", xxxl: "0.98rem" }, textTransform: "uppercase", letterSpacing: "0.09em", color: "#555" }}>
                        {tStr(t, "calc.totalAmount.label", "Calculate processing time")}
                      </Typography>
                    </Box>
                    <Switch
                      size="small"
                      checked={totalAmountMode}
                      onChange={(event) => setTotalAmountMode(event.target.checked)}
                      sx={{ transform: { xxl: "scale(1.18)", xxxl: "scale(1.35)" }, transformOrigin: "right center", "& .MuiSwitch-thumb": { bgcolor: totalAmountMode ? "#0000FF" : "#ccc" }, "& .MuiSwitch-track": { bgcolor: totalAmountMode ? "#0000FF50" : "#e0e0e0" } }}
                    />
                  </Box>
                  <Collapse in={totalAmountMode}>
                    <Box sx={{ px: { xs: "1rem", xxl: "1.25rem", xxxl: "1.5rem" }, pb: { xs: "1rem", xxl: "1.25rem", xxxl: "1.5rem" }, borderTop: "1px solid #f2f2f2" }}>
                      <Typography sx={{ fontSize: { xs: "0.72rem", xxl: "0.82rem", xxxl: "0.96rem" }, color: "#888", mt: "0.65rem", mb: "0.75rem" }}>
                        {tStr(t, "calc.totalAmount.hint", "Enter the total amount of waste to process")}
                      </Typography>
                      <Box sx={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                        <FloatInput
                          value={totalAmountValue}
                          onChange={setTotalAmountValue}
                          unit={totalAmountUnit}
                          min={0}
                          max={9999999}
                          step={totalAmountUnit === "t" ? 1 : 100}
                          sx={{ flex: 1 }}
                        />
                        <ToggleButtonGroup
                          exclusive
                          value={totalAmountUnit}
                          onChange={(_, value) => value && setTotalAmountUnit(value)}
                          size="small"
                          sx={{ "& .MuiToggleButton-root": { borderRadius: 0, fontWeight: 700, fontSize: { xs: "0.75rem", xxl: "0.96rem", xxxl: "1.14rem" }, px: { xs: "0.75rem", xxl: "1.15rem", xxxl: "1.4rem" }, py: { xxl: "0.45rem", xxxl: "0.6rem" }, minHeight: { xxl: "3rem", xxxl: "3.5rem" }, border: "1px solid #ddd", "&.Mui-selected": { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#333" } } } }}
                        >
                          <ToggleButton value="t">t</ToggleButton>
                          <ToggleButton value="kg">kg</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                      {stats.hoursToProcess !== null && (
                        <Box sx={{ mt: "0.75rem", p: { xs: "0.6rem", xxl: "0.8rem", xxxl: "1rem" }, bgcolor: "#000", color: "#fff", display: "flex", alignItems: "center", gap: { xs: "0.6rem", xxl: "0.8rem", xxxl: "1rem" } }}>
                          <FaClock size={14} />
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: "1rem", xxl: "1.14rem", xxxl: "1.32rem" }, lineHeight: 1 }}>
                              {stats.hoursToProcess < 1 ? `${Math.round(stats.hoursToProcess * 60)} ${tStr(t, "unit.minutes", "minutes")}` : `${stats.hoursToProcess.toFixed(2)} ${tStr(t, "unit.hours", "hours")}`}
                            </Typography>
                            <Typography sx={{ fontSize: { xs: "0.65rem", xxl: "0.74rem", xxxl: "0.88rem" }, opacity: 1, mt: "0.15rem" }}>
                              {tStr(t, "calc.totalAmount.result", "to process at current throughput rate")}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      {!stats.hasInput && totalAmountMode && (
                        <Typography sx={{ fontSize: { xs: "0.7rem", xxl: "0.8rem", xxxl: "0.94rem" }, color: "#ccc", mt: "0.5rem" }}>
                          {tStr(t, "calc.totalAmount.noMix", "Add waste types with throughput to calculate")}
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </Box>

                <Box sx={{ mb: "0.75rem", border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: "1rem", xxl: "1.25rem", xxxl: "1.5rem" }, py: { xs: "0.7rem", xxl: "0.9rem", xxxl: "1.05rem" }, cursor: "pointer", userSelect: "none" }} onClick={() => setAdvancedOpen((prev) => !prev)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <FaFlask size={11} color="#999" />
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.73rem", xxl: "0.84rem", xxxl: "0.98rem" }, textTransform: "uppercase", letterSpacing: "0.09em", color: "#666" }}>
                        {tStr(t, "calc.methodology.title", "Moisture correction — EN 14918")}
                      </Typography>
                    </Box>
                    {advancedOpen ? <FaChevronUp size={11} color="#bbb" /> : <FaChevronDown size={11} color="#bbb" />}
                  </Box>
                  <Collapse in={advancedOpen}>
                    <Box sx={{ px: "1rem", pb: "1rem", borderTop: "1px solid #f2f2f2" }}>
                      <Box sx={{ mt: "0.75rem", p: "0.65rem", bgcolor: "#f5f5f5", fontFamily: "monospace", fontSize: { xs: "0.75rem", xxl: "0.86rem", xxxl: "1rem" }, color: "#222", borderLeft: "3px solid #0000FF" }}>
                        NCV_ar = HHV_dry × (1 − M/100) − 2.443 × (M/100)
                      </Box>
                      <Typography sx={{ fontSize: { xs: "0.73rem", xxl: "0.84rem", xxxl: "0.98rem" }, color: "#666", lineHeight: 1.65, mt: "0.6rem" }}>
                        <strong>M</strong> = {tStr(t, "calc.methodology.moisture", "moisture %")}. <strong>2.443 MJ/kg</strong> = {tStr(t, "calc.methodology.latentHeat", "latent heat of vaporisation at 25°C")}.{" "}
                        {tStr(t, "calc.methodology.explanation", "Two loss mechanisms: (1) mass dilution by inert water, (2) evaporation energy during combustion. Non-linear — wet waste loses disproportionately more.")}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.68rem", xxl: "0.78rem", xxxl: "0.9rem" }, color: "#bbb", mt: "0.6rem" }}>
                        η = 21.18% — {tStr(t, "calc.methodology.calibration", "WP1000 ref: 1 t/h biomass @ HHV 17 MJ/kg → 1 MWh electrical")}
                      </Typography>
                    </Box>
                  </Collapse>
                </Box>

                <Box sx={{ mb: "0.75rem" }}>
                  <Button
                    onClick={() => void handleExportPDF()}
                    startIcon={<FaFilePdf size={13} />}
                    sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, borderRadius: 0, px: { xs: "1.25rem", xxl: "1.8rem", xxxl: "2.2rem" }, py: { xs: "0.55rem", xxl: "0.85rem", xxxl: "1rem" }, fontSize: { xs: "0.82rem", xl: "0.9rem", xxl: "1.14rem", xxxl: "1.34rem" }, textTransform: "none", "& .MuiButton-startIcon svg": { width: { xxl: "1.05rem", xxxl: "1.25rem" }, height: { xxl: "1.05rem", xxxl: "1.25rem" } }, "&:hover": { bgcolor: "#0000FF" } }}
                  >
                    {tStr(t, "calc.exportPdf", "Export PDF Report")}
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "1rem", xxl: "1.2rem", xxxl: "1.4rem" } }}>
                {!stats.hasInput && (
                  <Box sx={{ p: "2rem", border: "2px dashed #ddd", textAlign: "center" }}>
                    <Typography sx={{ color: "#d0d0d0", fontSize: { xs: "0.85rem", xxl: "0.98rem", xxxl: "1.12rem" } }}>
                      {tStr(t, "calc.emptyResults", "Configure your waste mix to see annual impact projections")}
                    </Typography>
                  </Box>
                )}

                {hoursCard && (
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.6rem" }}>
                    <ImpactCard {...hoursCard} />
                  </Box>
                )}

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: { xs: "0.55rem", xl: "0.7rem", xxl: "0.9rem", xxxl: "1.1rem" } }}>
                  {metrics.map((metric) => (
                    <ImpactCard key={metric.label} {...metric} />
                  ))}
                </Box>

                {stats.breakdown.length > 0 && (
                  <Box sx={{ border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                    <Box sx={{ px: "1rem", py: "0.6rem", borderBottom: "1px solid #f0f0f0" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.7rem", xxl: "0.8rem", xxxl: "0.94rem" }, textTransform: "uppercase", letterSpacing: "0.09em", color: "#888" }}>
                        {tStr(t, "calc.breakdown.title", "Energy contribution by type")}
                      </Typography>
                    </Box>
                    <Box sx={{ p: "0.85rem" }}>
                      {stats.breakdown.map((row) => {
                        const wasteType = allTypes.find((item) => item.key === row.key);
                        if (!wasteType) {
                          return null;
                        }

                        const pct = stats.totalEnergyMJPerHour > 0 ? (row.energyMJ / stats.totalEnergyMJPerHour) * 100 : 0;

                        return (
                          <Box key={row.key} sx={{ mb: "0.6rem" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.18rem" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <Box component="img" src={wasteType.image} alt={row.label} sx={{ width: { xs: 18, xxl: 22, xxxl: 26 }, height: { xs: 18, xxl: 22, xxxl: 26 }, objectFit: "cover", flexShrink: 0 }} onError={(event) => { (event.target as HTMLImageElement).style.display = "none"; }} />
                                <Typography sx={{ fontSize: { xs: "0.74rem", xxl: "0.84rem", xxxl: "0.98rem" }, fontWeight: 600, color: "#222" }}>{row.label}</Typography>
                                <Typography sx={{ fontSize: { xs: "0.62rem", xxl: "0.72rem", xxxl: "0.84rem" }, color: "#ccc", fontFamily: "monospace" }}>{row.tonnes.toFixed(2)} t/h · {row.ncvArVal.toFixed(1)} MJ/kg</Typography>
                              </Box>
                              <Typography sx={{ fontSize: { xs: "0.74rem", xxl: "0.84rem", xxxl: "0.98rem" }, fontWeight: 700, color: wasteType.color, ml: "0.5rem", flexShrink: 0 }}>{pct.toFixed(1)}%</Typography>
                            </Box>
                            <Box sx={{ height: 3, bgcolor: "#f0f0f0" }}>
                              <Box sx={{ height: "100%", width: `${pct}%`, bgcolor: wasteType.color, transition: "width 0.3s ease" }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                <Box sx={{ border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "0.45rem", px: "1rem", py: "0.65rem", cursor: "pointer", userSelect: "none" }} onClick={() => setDisclaimerOpen((prev) => !prev)}>
                    <FaInfoCircle size={12} color="#aaa" />
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", xxl: "0.98rem", xxxl: "1.18rem" }, color: "#666", flex: 1 }}>
                      {tStr(t, "calc.disclaimer.trigger", "Estimates based on the Cluj – CMID project")}
                    </Typography>
                    {disclaimerOpen ? <FaChevronUp size={10} color="#ccc" /> : <FaChevronDown size={10} color="#ccc" />}
                  </Box>
                  <Collapse in={disclaimerOpen}>
                    <Box sx={{ px: "1rem", pb: "1rem", borderTop: "1px solid #f5f5f5" }}>
                      <Typography sx={{ fontSize: { xs: "0.73rem", xxl: "0.96rem", xxxl: "1.16rem" }, color: "#666", lineHeight: 1.7, mt: "0.7rem" }}>
                        {tStr(t, "calc.disclaimer.body", "All figures are approximate estimates based on the Cluj – CMID reference installation: 2× WP1500 units, 70 t/day, 25,550 t/year, 24/7 operation with maintenance on ~10 major holidays")} ({CONSTANTS.uptimePct}% {tStr(t, "calc.disclaimer.uptime", "uptime")}, {CONSTANTS.annualHours} h/yr).
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.73rem", xxl: "0.96rem", xxxl: "1.16rem" }, color: "#ED1C24", fontWeight: 700, lineHeight: 1.7, mt: "0.4rem" }}>
                        ⚠ {tStr(t, "calc.disclaimer.warning", "Output depends on HHV, moisture, ash content, and particle size. Adjust per-type moisture in each row.")}
                      </Typography>
                      <Box sx={{ mt: "0.7rem", pt: "0.7rem", borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {[
                          [tStr(t, "calc.disclaimer.src.moisture", "Moisture formula"), "EN 14918 / ISO 1928"],
                          [tStr(t, "calc.disclaimer.src.households", "Households"), "EU avg 3.6 MWh/yr · Eurostat 2023"],
                          [tStr(t, "calc.disclaimer.src.co2", "CO₂ avoided"), "0.30 t/tonne MSW · IPCC Tier II"],
                          [tStr(t, "calc.disclaimer.src.cars", "Cars removed"), "107 g/km × 12,000 km/yr · EEA 2023"],
                          [tStr(t, "calc.disclaimer.src.trees", "Trees equiv."), "45 trees/t CO2/yr · US EPA 2024"],
                        ].map(([label, source]) => (
                          <Typography key={label} sx={{ fontSize: { xs: "0.68rem", xxl: "0.88rem", xxxl: "1.05rem" }, color: "#aaa", lineHeight: 1.5 }}>
                            <strong style={{ color: "#555" }}>{label}:</strong> {source}
                          </Typography>
                        ))}
                      </Box>
                      <Typography sx={{ fontSize: { xs: "0.66rem", xxl: "0.84rem", xxxl: "1rem" }, color: "#ddd", mt: "0.5rem" }}>
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
