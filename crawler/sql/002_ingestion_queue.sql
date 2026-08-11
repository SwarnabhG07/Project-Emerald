-- ------------------------------------------------------------
-- Ingestion Queue (Section 1.3)
-- Newly pulled schemes sit here until an admin approves them.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingestion_queue (
    id SERIAL PRIMARY KEY,
    source_code TEXT NOT NULL,
    external_id TEXT,
    raw_data JSONB NOT NULL,
    normalized_name TEXT,
    normalized_ministry TEXT,
    normalized_state TEXT,
    status TEXT DEFAULT 'pending_review',
    matched_scheme_id INTEGER REFERENCES schemes(id),
    similarity_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_queue_status ON ingestion_queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_source_ext ON ingestion_queue(source_code, external_id);
