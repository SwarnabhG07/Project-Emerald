export interface FarmerProfile {
  fullName?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  state?: string;
  district?: string;
  village?: string;
  category?: "General" | "SC" | "ST" | "OBC" | "EWS";
  subCategory?: string;
  landSizeAcres?: number;
  landOwnership?: "Owner" | "Tenant" | "Sharecropper" | "Landless";
  khasraNumber?: string;
  annualIncome?: number;
  bankAccount?: boolean;
  aadhaarLinked?: boolean;
}

export interface SchemeRule {
  and?: SchemeRule[];
  or?: SchemeRule[];
  not?: SchemeRule;
  "==": [any, any];
  "!=": [any, any];
  "<": [any, any];
  "<=": [any, any];
  ">": [any, any];
  ">=": [any, any];
  in: [any, any[]];
  var: string;
  [key: string]: any;
}

export interface MatchSignals {
  keyword: number;
  semantic: number;
  documentReadiness: number;
}

export interface MatchResult {
  schemeId: string;
  schemeName: string;
  ministry: string;
  state: string | null;
  benefit: string;
  benefitAmount: number | null;
  deadline: string | null;
  link: string | null;
  eligibilityVersion: number;
  requiredDocuments: string[];
  uploadedDocuments: string[];
  missingDocuments: string[];
  matchScore?: number;
  signals?: MatchSignals | null;
}

export interface NearMissResult extends MatchResult {
  failedConditions: string[];
  actions: ActionNode[];
}

export interface ActionNode {
  actionType: string;
  label: string;
  field?: string;
  documentType?: string;
  unlockedSchemes: string[];
  impact: number;
}

export interface MatchResponse {
  eligible: MatchResult[];
  nearMiss: NearMissResult[];
  evaluatedAt: string;
  totalSchemesEvaluated: number;
}

export interface HybridMatchResponse extends MatchResponse {
  method: string;
  queryText?: string;
}