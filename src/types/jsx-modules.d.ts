declare module "*.jsx" {
  import type { ComponentType } from "react";

  const DefaultComponent: ComponentType<any>;
  export default DefaultComponent;

  export const Model: ComponentType<any>;
}
