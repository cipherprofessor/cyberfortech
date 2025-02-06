CREATE TABLE IF NOT EXISTS forum_attachments (
    attachment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);