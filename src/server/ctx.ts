import type { Manifest } from "../shared/manifest";
import type { Parser } from "./utils/parseData";

export interface CTX {
  manifest: Manifest;
  parsers: Record<string, Parser<any>>;
  unparsers: Record<string, Parser<any>>;
}
