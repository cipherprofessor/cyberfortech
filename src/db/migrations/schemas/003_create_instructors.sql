-- Description: Creates instructors table and related functionality
-- Version: 3
-- Depends on: 002_create_users.sql

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    bio TEXT,
    contact_number TEXT,
    address TEXT,
    profile_image_url TEXT,
    specialization TEXT,
    qualification TEXT,
    years_of_experience INTEGER,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    social_links TEXT CHECK (json_valid(social_links) OR social_links IS NULL),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create instructor indexes
CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors(email);
CREATE INDEX IF NOT EXISTS idx_instructors_status ON instructors(status);
CREATE INDEX IF NOT EXISTS idx_instructors_rating ON instructors(rating);
CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON instructors(user_id);

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trig_instructors_updated_at;

-- Create trigger for updated_at timestamp
CREATE TRIGGER trig_instructors_updated_at
AFTER UPDATE ON instructors
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
  UPDATE instructors SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- At the end of 003_create_instructors.sql, use:
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (3, '003_create_instructors');