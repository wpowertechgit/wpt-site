import jsPDF from "jspdf";
import { CONSTANTS, type WasteType } from "./model";
import { fetchImageAsDataUrl, getPdfLogoDataUrl, PDF_LOGO_HEIGHT_PX, PDF_LOGO_WIDTH_PX, registerPdfFonts } from "./pdf";

interface BreakdownRow {
  label: string;
  key: string;
  tonnes: number;
  moisture: number;
  ncvArVal: number;
  energyMJ: number;
  image: string;
}

interface ReportStats {
  totalTonnesPerHour: number;
  totalEnergyMJPerHour: number;
  mwhElectricPerHour: string;
  annualMWhStr: string;
  monthlyMWhStr: string;
  dailyMWhStr: string;
  annualTonsStr: string;
  co2AnnualStr: string;
  householdsAnnualStr: string;
  treesAnnualStr: string;
  carsAnnualStr: string;
  hoursToProcess: number | null;
  breakdown: BreakdownRow[];
  annualHours: number;
}

interface ExportImpactCalculatorPdfArgs {
  stats: ReportStats;
  allTypes: WasteType[];
  totalAmountUnit: "t" | "kg";
  totalAmountValue: number;
}

export async function exportImpactCalculatorPdf({
  stats,
  allTypes,
  totalAmountUnit,
  totalAmountValue,
}: ExportImpactCalculatorPdfArgs): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [297, 560] });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = 0;
  let titleFont = "helvetica";
  let bodyFont = "helvetica";

  try {
    await registerPdfFonts(doc);
    titleFont = "Stack Sans Headline";
    bodyFont = "Figtree";
  } catch (error) {
    console.error("Font load failed", error);
  }

  try {
    const logoDataUrl = await getPdfLogoDataUrl();
    const logoH = 9;
    const logoW = (logoH * PDF_LOGO_WIDTH_PX) / PDF_LOGO_HEIGHT_PX;
    doc.addImage(logoDataUrl, "PNG", margin, 12, logoW, logoH);
  } catch {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont(titleFont, "bold");
    doc.text("WASTE POWERTECH SRL", margin, 20);
  }

  y = 30;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(titleFont, "bold");
  doc.text("Environmental Impact Estimate Report", pageW / 2, y, { align: "center" });
  y += 7;
  doc.setFontSize(8.5);
  doc.setFont(bodyFont, "normal");
  doc.setTextColor(90, 90, 90);
  doc.text(`WP1000 · Mix: ${stats.totalTonnesPerHour.toFixed(2)} t/h · Date: ${new Date().toLocaleDateString("en-GB")}`, pageW / 2, y, { align: "center" });
  y += 5;
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text("Estimates based on the Cluj – CMID project reference installation.", pageW / 2, y, { align: "center" });
  y += 7;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);

  y += 8;
  doc.setFontSize(11.5);
  doc.setFont(titleFont, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Waste Mix Input", margin, y);
  y += 6;

  const imgColW = 14;
  const remainW = pageW - margin * 2 - imgColW - 2;
  const cW = remainW / 5;

  doc.setFontSize(7.5);
  doc.setFont(bodyFont, "bold");
  doc.setTextColor(120, 120, 120);
  ["Waste Type", "t/h", "HHV_dry", "NCV_ar", "Energy (GJ/h)"].forEach((header, index) => {
    doc.text(header, margin + imgColW + 2 + index * cW, y);
  });
  y += 4;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  if (stats.breakdown.length === 0) {
    doc.setFont(bodyFont, "normal");
    doc.setTextColor(160, 160, 160);
    doc.text("No waste inputs configured.", margin, y);
    y += 7;
  } else {
    const imgDataUrls = await Promise.all(stats.breakdown.map((row) => fetchImageAsDataUrl(row.image)));

    doc.setFontSize(8.2);
    stats.breakdown.forEach((row, index) => {
      const wasteType = allTypes.find((item) => item.key === row.key);
      const rowH = 10;

      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin - 2, y - 5, pageW - margin * 2 + 4, rowH, "F");
      }

      const imgUrl = imgDataUrls[index];
      if (imgUrl) {
        try {
          doc.addImage(imgUrl, "PNG", margin, y - 4.5, imgColW - 2, 9, undefined, "FAST");
        } catch {
          doc.setFillColor(230, 230, 230);
          doc.rect(margin, y - 4.5, imgColW - 2, 9, "F");
        }
      } else {
        doc.setFillColor(200, 200, 200);
        doc.rect(margin, y - 4.5, imgColW - 2, 9, "F");
      }

      doc.setFont(bodyFont, "normal");
      doc.setTextColor(0, 0, 0);
      [row.label, row.tonnes.toFixed(2), `${wasteType?.hhvDry.toFixed(1) ?? "0.0"} MJ/kg`, `${row.ncvArVal.toFixed(2)} MJ/kg`, (row.energyMJ / 1000).toFixed(3)].forEach((cell, cellIndex) => {
        doc.text(cell, margin + imgColW + 2 + cellIndex * cW, y);
      });
      y += rowH;
    });
  }

  y += 1;
  doc.setFillColor(0, 0, 0);
  doc.rect(margin - 2, y - 4.5, pageW - margin * 2 + 4, 8, "F");
  doc.setFont(bodyFont, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", margin + imgColW + 2, y);
  doc.text(stats.totalTonnesPerHour.toFixed(2), margin + imgColW + 2 + cW, y);
  doc.text("—", margin + imgColW + 2 + 2 * cW, y);
  doc.text("—", margin + imgColW + 2 + 3 * cW, y);
  doc.text((stats.totalEnergyMJPerHour / 1000).toFixed(3), margin + imgColW + 2 + 4 * cW, y);
  y += 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 7;
  doc.setFontSize(11.5);
  doc.setFont(titleFont, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Annual Impact Results (WP1000)", margin, y);
  y += 6;

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
  results.forEach(([key, value, note], index) => {
    const rowH = note ? 11 : 7;
    if (index % 2 === 0) {
      doc.setFillColor(244, 244, 244);
      doc.rect(margin - 2, y - 4.5, pageW - margin * 2 + 4, rowH, "F");
    }

    doc.setFont(bodyFont, "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(`${key}:`, margin, y);
    doc.setTextColor(0, 0, 200);
    doc.text(value, pageW - margin, y, { align: "right" });

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

  y += 2;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFontSize(10.5);
  doc.setFont(titleFont, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Methodology & Sources", margin, y);
  y += 5;

  const sources = [
    "MOISTURE: EN 14918/ISO 1928 — NCV_ar = HHV_dry×(1−M/100) − 2.443×(M/100). Mass dilution + evaporation energy. Non-linear penalty.",
    "ENERGY: MWh_electric = (Σ kg × NCV_ar [MJ/kg]) / 3600 [MJ/MWh] × η. η = 21.18% (WP1000 ref: 1 t/h biomass HHV 17 MJ/kg → 1 MWh).",
    "HHV_DRY (MJ/kg): Biomass 17, Hydrocarbons 42, Plastic 38, Textiles 18, Elastomers 38, Cellulosics 16, Carbon Resources 28.",
    "UPTIME: 24×(365−10)=8,520 h/yr (Cluj-CMID: 25,550 t/yr ÷ 2×1.5 t/h ÷ 24h = 354.9 d).",
    "HOUSEHOLDS 3.6 MWh/yr (Eurostat 2023) · CO2 0.30 t/tonne MSW (IPCC Tier II) · CARS 1.28 t CO2/yr (EEA 2023) · TREES 45/t CO2 (EPA 2024).",
  ];

  doc.setFont(bodyFont, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  sources.forEach((source) => {
    const lines = doc.splitTextToSize(`• ${source}`, pageW - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.2 + 1.5;
  });

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
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  const disclaimer = doc.splitTextToSize("All figures are approximate estimates. Calorific values are literature-sourced midpoints. Actual output depends on waste composition, particle size, ash content, and operating conditions. This document does not constitute a binding commercial proposal. Waste Powertech SRL · wpowertech.ro", pageW - margin * 2);
  doc.text(disclaimer, margin, y);

  doc.setFillColor(0, 0, 0);
  doc.rect(0, pageH - 13, pageW, 13, "F");
  doc.setFontSize(7.5);
  doc.setFont(bodyFont, "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("Waste Powertech SRL  ·  wpowertech.ro", pageW / 2, pageH - 4.5, { align: "center" });

  doc.save(`WPT-Impact-WasteMix-${new Date().toISOString().slice(0, 10)}.pdf`);
}
