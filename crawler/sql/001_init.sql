-- Enable UUID extension (useful for future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- Sources table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    last_crawled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Schemes table (common internal schema, Section 1.1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schemes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    ministry TEXT,
    state TEXT,
    category TEXT,
    benefits TEXT,
    eligibility_text TEXT,
    documents_needed TEXT,
    link TEXT,
    source TEXT,
    status TEXT DEFAULT 'draft',
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    last_confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    current_version_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Scheme versions table (Section 1.2)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scheme_versions (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    ministry TEXT,
    state TEXT,
    category TEXT,
    benefits TEXT,
    eligibility_text TEXT,
    documents_needed TEXT,
    link TEXT,
    source_trigger TEXT,
    changed_fields JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(scheme_id, version_number)
);

-- Idempotent foreign key (safe to re-run)
DO $$
BEGIN
    ALTER TABLE schemes
    ADD CONSTRAINT fk_current_version
    FOREIGN KEY (current_version_id)
    REFERENCES scheme_versions(id)
    ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

-- ------------------------------------------------------------
-- Admin audit logs (Section 1.3)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id SERIAL PRIMARY KEY,
    admin_user_id TEXT,
    action TEXT NOT NULL,
    scheme_id INTEGER REFERENCES schemes(id) ON DELETE SET NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_schemes_status ON schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_schemes_name ON schemes(name);
CREATE INDEX IF NOT EXISTS idx_scheme_versions_scheme_id ON scheme_versions(scheme_id);
