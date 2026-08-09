from .local_json import LocalJsonAdapter

ADAPTERS = {
    "local_seed_data": LocalJsonAdapter,
}

def get_adapter(source_code: str):
    if source_code not in ADAPTERS:
        raise ValueError(f"Unknown source: {source_code}. Available: {list(ADAPTERS.keys())}")
    return ADAPTERS[source_code]()
