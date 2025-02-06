CREATE TABLE IF NOT EXISTS forum_user_activity (
    user_id INTEGER PRIMARY KEY,
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS forum_user_stats (
    user_id INTEGER PRIMARY KEY,
    total_posts INTEGER DEFAULT 0,
    total_topics INTEGER DEFAULT 0,
    reputation_points INTEGER DEFAULT 0,
    last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);