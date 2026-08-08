import argparse
import json

from adapters import get_adapter
from core.db import init_db
from core.pipeline import run_pipeline


def main():
    parser = argparse.ArgumentParser(
        description="Project Emerald scheme ingestion pipeline"
    )
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("hello", help="Print a simple test message")
    subparsers.add_parser("init-db", help="Initialize the PostgreSQL database schema")

    fetch_parser = subparsers.add_parser(
        "fetch", help="Fetch data from a source (no DB save)"
    )
    fetch_parser.add_argument("--source", required=True, help="Source code, e.g. local_seed_data")

    run_parser = subparsers.add_parser(
        "run", help="Fetch data and save to ingestion queue"
    )
    run_parser.add_argument("--source", required=True, help="Source code, e.g. local_seed_data")

    args = parser.parse_args()

    if args.command == "hello":
        print("Project Emerald crawler skeleton OK")

    elif args.command == "init-db":
        init_db()

    elif args.command == "fetch":
        adapter = get_adapter(args.source)
        records = adapter.fetch()
        print(f"Fetched {len(records)} records from source: {args.source}")
        if records:
            print("\n--- FIRST RECORD ---")
            print(json.dumps(records[0].raw_json, indent=2, ensure_ascii=False))

    elif args.command == "run":
        run_pipeline(args.source)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
