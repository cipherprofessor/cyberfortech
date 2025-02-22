-- src/db/migrations/schemas/005_create_forum_base.sql
-- Description: Creates base forum structure including categories and subcategories
-- Version: 5
-- Depends on: 004_create_courses.sql

-- Create forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME
);

-- Create forum subcategories table
CREATE TABLE IF NOT EXISTS forum_subcategories (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id)
);

-- Create forum category stats table
CREATE TABLE IF NOT EXISTS forum_category_stats (
    category_id TEXT PRIMARY KEY,
    total_topics INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    last_post_id TEXT,
    last_post_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_categories_order ON forum_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_forum_subcategories_category ON forum_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_subcategories_order ON forum_subcategories(display_order);
CREATE INDEX IF NOT EXISTS idx_forum_category_stats_last_post ON forum_category_stats(last_post_at);

-- Drop existing triggers
DROP TRIGGER IF EXISTS trig_forum_categories_updated_at;
DROP TRIGGER IF EXISTS trig_forum_subcategories_updated_at;

-- Create triggers for updated_at timestamps
CREATE TRIGGER trig_forum_categories_updated_at 
AFTER UPDATE ON forum_categories 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE forum_categories SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_forum_subcategories_updated_at 
AFTER UPDATE ON forum_subcategories 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE forum_subcategories SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Insert version record
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (5, '005_create_forum_base');