import type { ActionNode } from "@/types";
import type { ConditionFailure } from "@/lib/rules/engine";

export function buildActions(
  failures: ConditionFailure[],
  schemeName: string,
  docsNeeded: string[],
  uploadedDocs: Set<string>
): ActionNode[] {
  const actions: ActionNode[] = [];

  const missingDocs = docsNeeded.filter((d) => !uploadedDocs.has(d));
  for (const docType of missingDocs) {
    actions.push({
      actionType: "upload_doc",
      label: `Upload ${formatDocType(docType)}`,
      documentType: docType,
      unlockedSchemes: [schemeName],
      impact: 1,
    });
  }

  // Structured field matching — immune to wording changes in describeCondition
  const failedFields = new Set(failures.flatMap((f) => f.fields));
  if (failedFields.has("bankAccount")) {
    actions.push({
      actionType: "update_field",
      label: "Open/link a bank account",
      field: "bankAccount",
      unlockedSchemes: [schemeName],
      impact: 1,
    });
  }
  if (failedFields.has("aadhaarLinked")) {
    actions.push({
      actionType: "update_field",
      label: "Link Aadhaar to bank account",
      field: "aadhaarLinked",
      unlockedSchemes: [schemeName],
      impact: 1,
    });
  }

  return actions;
}

export function formatDocType(type: string): string {
  const labels: Record<string, string> = {
    aadhaar: "Aadhaar Card",
    category_cert: "Category Certificate",
    land_record: "Land Record (Khasra/Khatauni)",
    bank_passbook: "Bank Passbook",
    photo: "Passport Photo",
  };
  return labels[type] || type;
}