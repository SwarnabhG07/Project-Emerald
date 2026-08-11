import { runIngestion } from "../lib/ingestion/ingest";

async function main() {
  const sources = process.argv.slice(2);
  console.log("🚚 Starting scheme ingestion", sources.length ? `(sources: ${sources.join(", ")})` : "(all sources)");
  const summary = await runIngestion({ sources: sources.length ? sources : undefined });
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });