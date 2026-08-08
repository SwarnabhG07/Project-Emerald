from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ExtractedScheme:
    source_code: str
    name: str
    ministry: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None
    benefits: Optional[str] = None
    eligibility_text: Optional[str] = None
    documents_needed: Optional[str] = None
    link: Optional[str] = None
    external_id: Optional[str] = None
    raw_json: Optional[dict] = field(default=None, repr=False)
