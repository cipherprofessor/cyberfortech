-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS schema_versions (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial version
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (1, '001_initial_setup');