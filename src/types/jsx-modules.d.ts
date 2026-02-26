declare module "*.jsx" {
  import type { ComponentType } from "react";

  const DefaultComponent: ComponentType<Record<string, unknown>>;
  export default DefaultComponent;

  export const Model: ComponentType<Record<string, unknown>>;
}
