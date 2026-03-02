import { CUSTOM_MIX_COMPONENT_TYPES, type WasteType } from "./model";

export type Translator = (key: string) => string;

export function tStr(t: Translator, key: string, fallback: string): string {
  const result = t(key);
  return result === key ? fallback : result;
}

export function getWasteLabel(t: Translator, wasteType: WasteType): string {
  return wasteType.displayName?.trim() || tStr(t, wasteType.key, wasteType.key);
}

export function getWasteTypicalSources(t: Translator, wasteType: WasteType): string {
  return tStr(t, `${wasteType.key}-sources`, wasteType.typicalSources);
}

export function getWasteDescription(t: Translator, wasteType: WasteType): string {
  if (!wasteType.customComposition) {
    return tStr(t, `${wasteType.key}-description`, "");
  }

  const defaultMoistureLabel = tStr(t, "calc.customMix.defaultMoistureLabel", "Default moisture");
  const defaultCalorificLabel = tStr(t, "calc.customMix.defaultCalorificLabel", "HHV dry");

  return Object.entries(wasteType.customComposition)
    .filter(([, pct]) => pct > 0)
    .map(([key, pct]) => {
      const component = CUSTOM_MIX_COMPONENT_TYPES.find((item) => item.key === key);
      if (!component) {
        return "";
      }

      const label = tStr(t, component.key, component.key);
      const description = tStr(t, `${component.key}-description`, "");

      return `${pct}% ${label}. ${description} ${defaultMoistureLabel}: ${component.defaultMoisture}%. ${defaultCalorificLabel}: ${component.hhvDry.toFixed(1)} MJ/kg.`;
    })
    .filter(Boolean)
    .join("\n");
}
