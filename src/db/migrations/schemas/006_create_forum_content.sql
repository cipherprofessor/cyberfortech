-- Description: Creates forum content tables including topics and posts
-- Version: 6
-- Depends on: 005_create_forum_base.sql

-- Create forum topics table
CREATE TABLE IF NOT EXISTS forum_topics (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    subcategory_id TEXT,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_post_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES forum_subcategories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    parent_id TEXT,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME,
    editor_id TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id),
    FOREIGN KEY (parent_id) REFERENCES forum_posts(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (editor_id) REFERENCES users(id)
);

-- Create forum topic tags table
CREATE TABLE IF NOT EXISTS forum_topic_tags (
    topic_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (topic_id, tag),
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_subcategory ON forum_topics(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created ON forum_topics(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_topics_last_post ON forum_topics(last_post_at);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent ON forum_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_topic_tags_tag ON forum_topic_tags(tag);

-- Create triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS trig_forum_topics_updated_at 
AFTER UPDATE ON forum_topics 
FOR EACH ROW 
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE forum_topics SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trig_forum_posts_updated_at 
AFTER UPDATE ON forum_posts 
FOR EACH ROW 
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE forum_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Create trigger to update last_post_at in topics
CREATE TRIGGER IF NOT EXISTS trig_forum_topic_last_post 
AFTER INSERT ON forum_posts 
WHEN NEW.is_deleted = FALSE
BEGIN
    UPDATE forum_topics 
    SET last_post_at = NEW.created_at 
    WHERE id = NEW.topic_id;
END;

-- Create trigger to update category stats
CREATE TRIGGER IF NOT EXISTS trig_forum_category_stats_post 
AFTER INSERT ON forum_posts 
WHEN NEW.is_deleted = FALSE
BEGIN
    UPDATE forum_category_stats 
    SET total_posts = total_posts + 1,
        last_post_id = NEW.id,
        last_post_at = NEW.created_at,
        updated_at = CURRENT_TIMESTAMP
    WHERE category_id = (
        SELECT category_id 
        FROM forum_topics 
        WHERE id = NEW.topic_id
    );
END;

-- Insert version record
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (6, '006_create_forum_content');