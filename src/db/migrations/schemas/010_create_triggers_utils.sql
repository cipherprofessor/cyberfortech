-- Description: Creates remaining triggers and utility functions
-- Version: 10
-- Depends on: 009_create_contacts.sql

-- Create trigger to maintain user stats on post deletion
CREATE TRIGGER IF NOT EXISTS trig_forum_user_stats_post_delete 
AFTER UPDATE ON forum_posts 
WHEN NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE
BEGIN
    UPDATE forum_user_stats 
    SET total_posts = total_posts - 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.author_id;
END;

-- Create trigger to maintain user stats on topic deletion
CREATE TRIGGER IF NOT EXISTS trig_forum_user_stats_topic_delete 
AFTER UPDATE ON forum_topics 
WHEN NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE
BEGIN
    UPDATE forum_user_stats 
    SET total_topics = total_topics - 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.author_id;
END;

-- Create trigger to maintain daily metrics for posts
CREATE TRIGGER IF NOT EXISTS trig_forum_daily_metrics_post 
AFTER INSERT ON forum_posts 
WHEN NEW.is_deleted = FALSE
BEGIN
    INSERT INTO forum_daily_metrics (
        id,
        date,
        total_posts,
        created_at,
        updated_at
    )
    VALUES (
        lower(hex(randomblob(16))),
        date(NEW.created_at),
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT(date) DO UPDATE SET
        total_posts = total_posts + 1,
        updated_at = CURRENT_TIMESTAMP;
END;

-- Create trigger to maintain daily metrics for topics
CREATE TRIGGER IF NOT EXISTS trig_forum_daily_metrics_topic 
AFTER INSERT ON forum_topics 
WHEN NEW.is_deleted = FALSE
BEGIN
    INSERT INTO forum_daily_metrics (
        id,
        date,
        total_topics,
        created_at,
        updated_at
    )
    VALUES (
        lower(hex(randomblob(16))),
        date(NEW.created_at),
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT(date) DO UPDATE SET
        total_topics = total_topics + 1,
        updated_at = CURRENT_TIMESTAMP;
END;

-- Create trigger to log topic views and update count
CREATE TRIGGER IF NOT EXISTS trig_forum_topic_views_update 
AFTER INSERT ON forum_topic_views
BEGIN
    UPDATE forum_topics 
    SET views = views + 1 
    WHERE id = NEW.topic_id;
END;

-- Create trigger to maintain reaction counts
CREATE TRIGGER IF NOT EXISTS trig_forum_reaction_stats 
AFTER INSERT ON forum_reactions
BEGIN
    UPDATE forum_user_stats 
    SET total_reactions_received = total_reactions_received + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = (
        SELECT author_id 
        FROM forum_posts 
        WHERE id = NEW.post_id
    );
END;

-- Insert version record
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (10, '010_create_triggers_utils');