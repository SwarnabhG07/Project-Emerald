export interface RawScheme {
  externalId?: string | null;
  name?: string | null;
  ministry?: string | null;
  state?: string | null;
  category?: string | null;
  description?: string | null;
  benefit?: string | null;
  benefitAmount?: number | null;
  eligibilityText?: string | null;
  eligibilityRules?: unknown; // JSON-Logic tree, if the source provides structured rules
  documents?: (string | null | undefined)[] | null;
  link?: string | null;
  deadline?: string | number | Date | null;
  lastUpdated?: string | number | Date | null;
  raw?: unknown;
}

/** Normalised shape produced by the cleaner */
export interface CleanedScheme {
  externalId: string | null;
  name: string;
  ministry: string;
  state: string | null;
  category: string;
  benefits: string;
  benefitAmount: number | null;
  eligibility: string;
  eligibilityRules: unknown | null;
  text: string; // combined searchable text (stored as Scheme.searchText)
  documentsRequired: string[];
  sourceLink: string | null;
  lastUpdated: Date;
  deadline: Date | null;
  description: string;
}