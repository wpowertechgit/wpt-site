export const BRAND = { waste: "#8E8E8E", power: "#ED1C24", tech: "#0000FF" };

export const CONSTANTS = {
  annualHours: 8520,
  uptimePct: ((8520 / (365 * 24)) * 100).toFixed(1),
  mwhPerHousehold: 3.6,
  co2PerTonneAvoided: 0.3,
  treesPerTonneCO2: 45,
  co2PerCarYear: 1.284,
  generatorEfficiency: 0.2118,
  latentHeatWater: 2.443,
  MJ_PER_MWH: 3600,
};

export interface WasteType {
  key: string;
  image: string;
  hhvDry: number;
  defaultMoisture: number;
  color: string;
  characteristics: string[];
  typicalSources: string;
  displayName?: string;
  isCustom?: boolean;
  customComposition?: Record<string, number>;
}

export interface WasteInput {
  tonnes: number;
  moisture: number;
}

export const WASTE_TYPES: WasteType[] = [
  {
    key: "biomass",
    image: "/wasteTypes/biomass.png",
    hhvDry: 17,
    defaultMoisture: 57.5,
    color: "#4a7c59",
    characteristics: ["HHV (dry): 17 MJ/kg", "Typical moisture: 45–70%", "Renewable / carbon-neutral"],
    typicalSources: "Agricultural residues, forestry waste, food processing byproducts, garden clippings",
  },
  {
    key: "hydrocarbons",
    image: "/wasteTypes/hydrocarbons.png",
    hhvDry: 42,
    defaultMoisture: 35,
    color: "#7b4f12",
    characteristics: ["HHV (dry): 42 MJ/kg", "Typical moisture: 25–45%", "Very high energy density"],
    typicalSources: "Used motor oils, industrial lubricants, wax residues, petroleum sludge",
  },
  {
    key: "plastic",
    image: "/wasteTypes/plastic.png",
    hhvDry: 38,
    defaultMoisture: 3,
    color: "#1a6fa8",
    characteristics: ["HHV (dry): 38 MJ/kg", "Typical moisture: 1–5%", "Non-biodegradable"],
    typicalSources: "Packaging, containers, films, industrial plastic scrap, HDPE, LDPE, PP, PET",
  },
  {
    key: "textiles",
    image: "/wasteTypes/textile.png",
    hhvDry: 18,
    defaultMoisture: 11.5,
    color: "#8b5e83",
    characteristics: ["HHV (dry): 18 MJ/kg", "Typical moisture: 8–15%", "Mixed natural/synthetic"],
    typicalSources: "Discarded clothing, industrial cut-offs, upholstery, carpet fibres",
  },
  {
    key: "elastomers",
    image: "/wasteTypes/elastomers.png",
    hhvDry: 38,
    defaultMoisture: 2,
    color: "#2c2c2c",
    characteristics: ["HHV (dry): 38 MJ/kg", "Typical moisture: <5%", "High fixed carbon"],
    typicalSources: "End-of-life tyres, conveyor belts, industrial seals, shoe soles",
  },
  {
    key: "cellulosics",
    image: "/wasteTypes/cellulosics.png",
    hhvDry: 16,
    defaultMoisture: 15,
    color: "#c8a45a",
    characteristics: ["HHV (dry): 16 MJ/kg", "Typical moisture: 10–20%", "High oxygen content"],
    typicalSources: "Cardboard packaging, newsprint, office paper, wood pallets, sawdust",
  },
  {
    key: "carbon-resources",
    image: "/wasteTypes/carbon.png",
    hhvDry: 28,
    defaultMoisture: 8.5,
    color: "#3d3d3d",
    characteristics: ["HHV (dry): 28 MJ/kg", "Typical moisture: 5–12%", "High fixed carbon"],
    typicalSources: "Coal fines, petroleum coke, charcoal residues, activated carbon waste",
  },
];

export const CUSTOM_MIX_ONLY_TYPES: WasteType[] = [
  {
    key: "inert-material",
    image: "/vectors/trashbin.svg",
    hhvDry: 0,
    defaultMoisture: 0,
    color: "#8E8E8E",
    characteristics: ["HHV (dry): 0 MJ/kg", "Typical moisture: 0–5%", "Separated before molecular disintegration"],
    typicalSources: "Glass, concrete, stone, metals and other inert fractions removed before processing",
  },
];

export const CUSTOM_MIX_COMPONENT_TYPES = [...WASTE_TYPES, ...CUSTOM_MIX_ONLY_TYPES];

export function createEmptyCustomComposition(): Record<string, number> {
  return Object.fromEntries(CUSTOM_MIX_COMPONENT_TYPES.map((wasteType) => [wasteType.key, 0]));
}

export function clampFloat(raw: string, min = 0, max = 99999): number {
  const cleaned = raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const numericValue = parseFloat(cleaned);

  if (Number.isNaN(numericValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numericValue));
}

export function ncvAr(hhvDry: number, moisture: number): number {
  return Math.max(0, hhvDry * (1 - moisture / 100) - CONSTANTS.latentHeatWater * (moisture / 100));
}

export function computeWeightedHhvAndMoisture(
  composition: Record<string, number>
): { hhvDry: number; moisture: number } {
  let totalPct = 0;
  let weightedHhv = 0;
  let weightedMoisture = 0;

  Object.entries(composition).forEach(([key, pct]) => {
    const wasteType = CUSTOM_MIX_COMPONENT_TYPES.find((item) => item.key === key);
    if (!wasteType || pct <= 0) {
      return;
    }

    totalPct += pct;
    weightedHhv += wasteType.hhvDry * pct;
    weightedMoisture += wasteType.defaultMoisture * pct;
  });

  if (totalPct === 0) {
    return { hhvDry: 0, moisture: 0 };
  }

  return {
    hhvDry: weightedHhv / totalPct,
    moisture: weightedMoisture / totalPct,
  };
}
