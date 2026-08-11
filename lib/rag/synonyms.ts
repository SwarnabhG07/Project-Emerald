/**
 * Domain synonym expansion — gives the local embedder semantic behaviour,
 * e.g. "fasal bima" ≈ "crop insurance", without an external model.
 */
const SYNONYM_GROUPS: string[][] = [
  ["crop insurance", "fasal bima", "pmfby", "yield loss", "insurance coverage", "natural calamity"],
  ["income support", "samman nidhi", "pm kisan", "pmkisan", "direct benefit transfer", "cash transfer"],
  ["credit", "loan", "kcc", "kisan credit card", "working capital", "interest subvention"],
  ["seed subsidy", "certified seeds", "seed", "national food security mission"],
  ["tractor", "farm machinery", "mechanization", "drone", "equipment subsidy"],
  ["irrigation", "drip irrigation", "sprinkler", "micro irrigation", "krishi sinchai", "water harvesting"],
  ["soil health", "soil testing", "fertilizer recommendation", "soil health card"],
  ["small farmer", "marginal farmer", "smallholder", "small and marginal"],
  ["tenant farmer", "tenant", "sharecropper", "lease farmer"],
  ["landless", "landless labourer", "landless agricultural worker"],
  ["bank account", "aadhaar linked", "dbt", "direct transfer", "passbook"],
  ["women farmer", "female farmer", "women"],
  ["warehouse", "storage", "godown", "post harvest", "agriculture infrastructure"],
];

export function expandSynonyms(text: string): string {
  const lower = ` ${text.toLowerCase()} `;
  const extras: string[] = [];
  for (const group of SYNONYM_GROUPS) {
    if (group.some((term) => lower.includes(term))) extras.push(...group);
  }
  return extras.length ? `${text} ${extras.join(" ")}` : text;
}