from abc import ABC, abstractmethod
from typing import List

from core.normalize import ExtractedScheme


class SourceAdapter(ABC):
    source_code: str = "base"
    source_name: str = "Base Source"

    @abstractmethod
    def fetch(self) -> List[ExtractedScheme]:
        raise NotImplementedError
