-- Description: Creates forum features including attachments and reactions
-- Version: 7
-- Depends on: 006_create_forum_content.sql

-- Create forum attachments table
CREATE TABLE IF NOT EXISTS forum_attachments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create forum reactions table
CREATE TABLE IF NOT EXISTS forum_reactions (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Create forum reaction types table
CREATE TABLE IF NOT EXISTS forum_reaction_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create thread subscriptions table
CREATE TABLE IF NOT EXISTS forum_subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    notification_level TEXT CHECK(notification_level IN ('all', 'first_post', 'none')) DEFAULT 'all',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id),
    UNIQUE(user_id, topic_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_attachments_post ON forum_attachments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_attachments_user ON forum_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_attachments_type ON forum_attachments(mime_type);
CREATE INDEX IF NOT EXISTS idx_forum_reactions_post ON forum_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_reactions_user ON forum_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_reactions_type ON forum_reactions(reaction_type);
CREATE INDEX IF NOT EXISTS idx_forum_subscriptions_user ON forum_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_subscriptions_topic ON forum_subscriptions(topic_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS trig_forum_reactions_updated_at 
AFTER UPDATE ON forum_reactions 
FOR EACH ROW 
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE forum_reactions SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trig_forum_subscriptions_updated_at 
AFTER UPDATE ON forum_subscriptions 
FOR EACH ROW 
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE forum_subscriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Insert version record
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (7, '007_create_forum_features');

