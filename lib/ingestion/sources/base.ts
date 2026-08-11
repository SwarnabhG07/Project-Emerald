import type { RawScheme } from "../types";

export interface SchemeSourceAdapter {
  id: string;
  name: string;
  fetch(): Promise<RawScheme[]>;
} 