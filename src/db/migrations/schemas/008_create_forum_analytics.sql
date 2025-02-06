-- Description: Creates forum analytics and activity tracking
-- Version: 8
-- Depends on: 007_create_forum_features.sql

-- Create forum user activity table
CREATE TABLE IF NOT EXISTS forum_user_activity (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    topic_id TEXT,
    post_id TEXT,
    category_id TEXT,
    activity_data TEXT CHECK (json_valid(activity_data) OR activity_data IS NULL),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id),
    FOREIGN KEY (category_id) REFERENCES forum_categories(id)
);

-- Create forum user stats table
CREATE TABLE IF NOT EXISTS forum_user_stats (
    user_id TEXT PRIMARY KEY,
    total_topics INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    total_reactions_received INTEGER DEFAULT 0,
    total_solutions_provided INTEGER DEFAULT 0,
    reputation_points INTEGER DEFAULT 0,
    activity_streak INTEGER DEFAULT 0,
    last_active_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create forum daily metrics table
CREATE TABLE IF NOT EXISTS forum_daily_metrics (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    total_posts INTEGER DEFAULT 0,
    total_topics INTEGER DEFAULT 0,
    total_users_active INTEGER DEFAULT 0,
    total_reactions INTEGER DEFAULT 0,
    metrics_data TEXT CHECK (json_valid(metrics_data) OR metrics_data IS NULL),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Create forum topic views table
CREATE TABLE IF NOT EXISTS forum_topic_views (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    user_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create forum post reactions table
CREATE TABLE IF NOT EXISTS forum_post_reactions (
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

-- Create forum reaction analytics table
CREATE TABLE IF NOT EXISTS forum_reaction_analytics (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    time_period TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_user_activity_user ON forum_user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_user_activity_type ON forum_user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_forum_user_activity_created ON forum_user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_user_stats_active ON forum_user_stats(last_active_at);
CREATE INDEX IF NOT EXISTS idx_forum_daily_metrics_date ON forum_daily_metrics(date);
CREATE INDEX IF NOT EXISTS idx_forum_topic_views_topic ON forum_topic_views(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_topic_views_user ON forum_topic_views(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_topic_views_time ON forum_topic_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_forum_post_reactions_post ON forum_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_reactions_user ON forum_post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_reactions_type ON forum_post_reactions(reaction_type);
CREATE INDEX IF NOT EXISTS idx_forum_reaction_analytics_post ON forum_reaction_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_reaction_analytics_type ON forum_reaction_analytics(reaction_type);
CREATE INDEX IF NOT EXISTS idx_forum_reaction_analytics_period ON forum_reaction_analytics(time_period);

-- Create triggers to update user stats
CREATE TRIGGER IF NOT EXISTS trig_forum_user_stats_post 
AFTER INSERT ON forum_posts 
WHEN NEW.is_deleted = FALSE
BEGIN
    UPDATE forum_user_stats 
    SET total_posts = total_posts + 1,
        last_active_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.author_id;
END;

CREATE TRIGGER IF NOT EXISTS trig_forum_user_stats_topic 
AFTER INSERT ON forum_topics 
WHEN NEW.is_deleted = FALSE
BEGIN
    UPDATE forum_user_stats 
    SET total_topics = total_topics + 1,
        last_active_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.author_id;
END;

CREATE TRIGGER IF NOT EXISTS trig_forum_user_stats_solution 
AFTER UPDATE ON forum_posts 
WHEN NEW.is_solution = TRUE AND OLD.is_solution = FALSE
BEGIN
    UPDATE forum_user_stats 
    SET total_solutions_provided = total_solutions_provided + 1,
        reputation_points = reputation_points + 10,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.author_id;
END;

-- Create trigger to update reaction analytics
CREATE TRIGGER IF NOT EXISTS trig_forum_reaction_analytics_update
AFTER INSERT ON forum_post_reactions
BEGIN
    INSERT OR REPLACE INTO forum_reaction_analytics (
        id,
        post_id,
        reaction_type,
        time_period,
        count,
        timestamp,
        created_at,
        updated_at
    )
    VALUES (
        CASE 
            WHEN (SELECT id FROM forum_reaction_analytics 
                  WHERE post_id = NEW.post_id 
                  AND reaction_type = NEW.reaction_type 
                  AND time_period = strftime('%Y-%m-%d', NEW.created_at)) IS NULL 
            THEN lower(hex(randomblob(16)))
            ELSE (SELECT id FROM forum_reaction_analytics 
                  WHERE post_id = NEW.post_id 
                  AND reaction_type = NEW.reaction_type 
                  AND time_period = strftime('%Y-%m-%d', NEW.created_at))
        END,
        NEW.post_id,
        NEW.reaction_type,
        strftime('%Y-%m-%d', NEW.created_at),
        COALESCE((SELECT count + 1 FROM forum_reaction_analytics 
                  WHERE post_id = NEW.post_id 
                  AND reaction_type = NEW.reaction_type 
                  AND time_period = strftime('%Y-%m-%d', NEW.created_at)), 1),
        CURRENT_TIMESTAMP,
        COALESCE((SELECT created_at FROM forum_reaction_analytics 
                  WHERE post_id = NEW.post_id 
                  AND reaction_type = NEW.reaction_type 
                  AND time_period = strftime('%Y-%m-%d', NEW.created_at)), 
                 CURRENT_TIMESTAMP),
        CURRENT_TIMESTAMP
    );
END;

-- Create trigger to update user stats for reactions received
CREATE TRIGGER IF NOT EXISTS trig_forum_user_stats_reaction
AFTER INSERT ON forum_post_reactions
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
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (8, '008_create_forum_analytics');