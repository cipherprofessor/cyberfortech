-- Create blog post likes table
CREATE TABLE IF NOT EXISTS blog_post_likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(post_id, user_id)
);

-- Create blog post bookmarks table
CREATE TABLE IF NOT EXISTS blog_post_bookmarks (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(post_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_post_likes_user ON blog_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_likes_post ON blog_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_bookmarks_user ON blog_post_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_bookmarks_post ON blog_post_bookmarks(post_id);