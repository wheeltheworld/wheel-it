import type { ComponentType } from "react";

export type CustomInput = ComponentType<{
  onChange: (value: any) => void;
  value: any;
}>;
