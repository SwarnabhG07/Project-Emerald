import { Node, Edge } from "@xyflow/react";

export const eligibleSchemes = [
  {
    id: "s1",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture",
    benefit: "₹6,000 / year",
    deadline: "2026-10-31",
    status: "Eligible",
  },
  {
    id: "s2",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    ministry: "Ministry of Agriculture",
    benefit: "Crop Insurance Coverage",
    deadline: "2026-09-15",
    status: "Eligible",
  },
  {
    id: "s3",
    name: "State Seed Subsidy Scheme",
    ministry: "State Dept. of Agriculture",
    benefit: "50% Subsidy on Seeds",
    deadline: "2026-08-30",
    status: "Eligible",
  },
];

export const graphInitialNodes: Node[] = [
  {
    id: "action-1",
    type: "input",
    data: { label: "Upload OBC Certificate" },
    position: { x: 250, y: 50 },
    style: { backgroundColor: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px", fontWeight: "bold" },
  },
  {
    id: "action-2",
    type: "input",
    data: { label: "Register Land Document (Khasra/Khatauni)" },
    position: { x: 600, y: 50 },
    style: { backgroundColor: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px", fontWeight: "bold" },
  },
  {
    id: "scheme-1",
    data: { label: "State Tractor Scheme (Unlock)" },
    position: { x: 100, y: 150 },
    style: { backgroundColor: "#e0e7ff", border: "1px solid #4f46e5", borderRadius: "8px", padding: "10px" },
  },
  {
    id: "scheme-2",
    data: { label: "National Fertilizer Subsidy (Unlock)" },
    position: { x: 350, y: 150 },
    style: { backgroundColor: "#e0e7ff", border: "1px solid #4f46e5", borderRadius: "8px", padding: "10px" },
  },
  {
    id: "scheme-3",
    data: { label: "Kisan Credit Card Extension (Unlock)" },
    position: { x: 600, y: 150 },
    style: { backgroundColor: "#e0e7ff", border: "1px solid #4f46e5", borderRadius: "8px", padding: "10px" },
  }
];

export const graphInitialEdges: Edge[] = [
  { id: "e1-1", source: "action-1", target: "scheme-1", animated: true },
  { id: "e1-2", source: "action-1", target: "scheme-2", animated: true },
  { id: "e2-1", source: "action-2", target: "scheme-2", animated: true },
  { id: "e2-3", source: "action-2", target: "scheme-3", animated: true },
];
