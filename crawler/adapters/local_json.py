import os
import json
from pathlib import Path
from typing import List
from core.normalize import ExtractedScheme
from .base import SourceAdapter

class LocalJsonAdapter(SourceAdapter):
    source_code = "local_seed_data"
    source_name = "Local Seed Data (Admin Bulk Upload)"

    def __init__(self):
        # Find the data folder relative to this file
        self.file_path = Path(__file__).resolve().parent.parent / "data" / "seed_schemes.json"

    def fetch(self) -> List[ExtractedScheme]:
        if not self.file_path.exists():
            raise FileNotFoundError(f"Seed file not found at {self.file_path}")

        with open(self.file_path, "r", encoding="utf-8") as f:
            raw_records = json.load(f)

        schemes = []
        for record in raw_records:
            scheme = ExtractedScheme(
                source_code=self.source_code,
                name=record.get("name"),
                ministry=record.get("ministry"),
                state=record.get("state"),
                category=record.get("category"),
                benefits=record.get("benefits"),
                eligibility_text=record.get("eligibility_text"),
                documents_needed=record.get("documents_needed"),
                link=record.get("link"),
                external_id=record.get("external_id"),
                raw_json=record
            )
            schemes.append(scheme)

        print(f"Loaded {len(schemes)} schemes from local seed file.")
        return schemes
