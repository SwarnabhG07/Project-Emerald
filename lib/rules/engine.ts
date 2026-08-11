import jsonLogic from "json-logic-js";

export interface ConditionFailure {
  /** Human-readable explanation of the failed condition */
  description: string;
  /** Profile fields referenced by the failed condition (for programmatic use) */
  fields: string[];
}

export interface EvaluationResult {
  eligible: boolean;
  failedConditions: string[];
  passedConditions: string[];
  failures: ConditionFailure[];
}

interface ConditionContext {
  [key: string]: any;
}

/**
 * Evaluates a JSON Logic rule against a context.
 * Handles arbitrarily nested and/or/not trees; malformed rules fail closed
 * instead of crashing the matcher.
 */
export function evaluateRule(
  ruleTree: any,
  context: ConditionContext
): EvaluationResult {
  const failures: ConditionFailure[] = [];
  const passedConditions: string[] = [];
  let eligible = false;

  try {
    walkRule(ruleTree, context, failures, passedConditions);
    eligible = Boolean(jsonLogic.apply(ruleTree, context));
  } catch {
    failures.push({
      description: "Rule evaluation error (invalid rule data)",
      fields: [],
    });
    eligible = false;
  }

  return {
    eligible,
    failedConditions: failures.map((f) => f.description),
    passedConditions,
    failures,
  };
}

function walkRule(
  node: any,
  context: ConditionContext,
  failures: ConditionFailure[],
  passed: string[]
): void {
  if (!node || typeof node !== "object") return;

  // AND: recurse so nested logic nodes are walked, not rendered as leaves
  if (Array.isArray(node.and)) {
    for (const sub of node.and) walkRule(sub, context, failures, passed);
    return;
  }

  // OR: at least one child must hold
  // OR: at least one child must hold
  if (Array.isArray(node.or)) {
    const results: { passed: boolean; failure: ConditionFailure }[] = (
      node.or as any[]
    ).map((sub: any) => ({
      passed: Boolean(jsonLogic.apply(sub, context)),
      failure: describeFailure(sub),
    }));
    if (results.some((r) => r.passed)) {
      for (const r of results) {
        if (r.passed) passed.push(r.failure.description);
      }
    } else {
      failures.push({
        description: `At least one of: ${results
          .map((r) => r.failure.description)
          .join(", or ")}`,
        fields: [...new Set(results.flatMap((r) => r.failure.fields))],
      });
    }
    return;
  }

  // NOT
  if (node.not !== undefined) {
    const result = Boolean(jsonLogic.apply(node, context));
    const inner = describeFailure(node.not);
    const desc = `Not (${inner.description})`;
    if (result) passed.push(desc);
    else failures.push({ description: desc, fields: inner.fields });
    return;
  }

  // Leaf condition
  const result = Boolean(jsonLogic.apply(node, context));
  const failure = describeFailure(node);
  if (result) passed.push(failure.description);
  else failures.push(failure);
}

function describeFailure(node: any): ConditionFailure {
  return { description: describeCondition(node), fields: collectVars(node) };
}

/**
 * Human-readable description of a condition. Recurses into nested
 * and/or/not so complex rules never render as "[object Object]".
 */
export function describeCondition(node: any): string {
  if (!node || typeof node !== "object") return "unknown condition";

  const op = Object.keys(node)[0];
  if (!op) return "unknown condition";
  const args = node[op];

  if (op === "and" && Array.isArray(args)) {
    return args.map((n: any) => describeCondition(n)).join(" AND ");
  }
  if (op === "or" && Array.isArray(args)) {
    return args.map((n: any) => describeCondition(n)).join(" OR ");
  }
  if (op === "not") {
    return `not (${describeCondition(args)})`;
  }
  if (op === "var") {
    return `Field '${args}'`;
  }
  if (!Array.isArray(args)) {
    return `${op} condition`;
  }

  const left = renderOperand(args[0]);
  const right = renderOperand(args[1]);

  switch (op) {
    case "==":
      return `${left} must equal ${right}`;
    case "!=":
      return `${left} must not equal ${right}`;
    case "<":
      return `${left} must be less than ${right}`;
    case "<=":
      return `${left} must be at most ${right}`;
    case ">":
      return `${left} must be greater than ${right}`;
    case ">=":
      return `${left} must be at least ${right}`;
    case "in":
      return `${left} must be one of: ${
        Array.isArray(args[1]) ? args[1].join(", ") : renderOperand(args[1])
      }`;
    default:
      return `${left} ${op} ${right}`;
  }
}

function renderOperand(op: any): string {
  if (op && typeof op === "object") {
    if (Array.isArray(op)) return `[${op.map(renderOperand).join(", ")}]`;
    if (op.var !== undefined) return formatFieldName(op.var);
    return describeCondition(op); // nested logic node used as an operand
  }
  if (typeof op === "string") return `"${op}"`;
  return String(op);
}

/** Collects every {var: ...} reference inside a JSON-Logic subtree */
function collectVars(node: any): string[] {
  if (node == null || typeof node !== "object") return [];
  if (Array.isArray(node)) {
    return [...new Set(node.flatMap((n) => collectVars(n)))];
  }
  if (node.var !== undefined) {
    return Array.isArray(node.var) ? node.var.map(String) : [String(node.var)];
  }
  return [...new Set(Object.values(node).flatMap((v) => collectVars(v)))];
}

function formatFieldName(name: string): string {
  const labels: Record<string, string> = {
    age: "Age",
    state: "State",
    district: "District",
    category: "Category",
    landSizeAcres: "Land size (acres)",
    landOwnership: "Land ownership",
    annualIncome: "Annual income",
    bankAccount: "Bank account",
    aadhaarLinked: "Aadhaar linked",
    khasraNumber: "Khasra number",
  };
  return labels[name] || name;
}