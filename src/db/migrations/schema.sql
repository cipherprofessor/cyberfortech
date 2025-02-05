-- Enable foreign key support
PRAGMA foreign_keys = ON;

------------------------------------------
-- Core System Tables
------------------------------------------

-- Drop existing table if needed
DROP TABLE IF EXISTS users;

-- Create enhanced users table with Clerk integration
CREATE TABLE IF NOT EXISTS users (
    -- Core Clerk Fields
    id TEXT PRIMARY KEY,                    -- Clerk User ID
    email TEXT UNIQUE NOT NULL,             -- Primary Email
    username TEXT UNIQUE,                   -- Username (if used)
    first_name TEXT,                        -- First Name
    last_name TEXT,                         -- Last Name
    full_name TEXT,                         -- Combined Name
    avatar_url TEXT,                        -- Profile Image URL
    
    -- Role and Status
    role TEXT CHECK(role IN ('student', 'instructor', 'admin', 'superadmin')) NOT NULL DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Profile Fields
    bio TEXT,                              -- User Biography
    location TEXT,                         -- User Location
    website TEXT,                          -- Personal Website
    social_links JSON,                     -- Social Media Links
    
    -- Preferences
    preferences JSON,                      -- User Preferences (theme, notifications, etc.)
    
    -- System Fields
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,                   -- For soft deletes
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Additional Metadata
    clerk_metadata JSON,                   -- Store additional Clerk metadata
    custom_metadata JSON                   -- For any additional custom data
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Create a view for active users
CREATE VIEW IF NOT EXISTS active_users AS
SELECT 
    id,
    email,
    full_name,
    role,
    avatar_url,
    created_at
FROM users
WHERE is_active = TRUE 
AND is_deleted = FALSE;

-- Create a user stats table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    login_count INTEGER DEFAULT 0,
    last_active_at DATETIME,
    posts_count INTEGER DEFAULT 0,
    topics_count INTEGER DEFAULT 0,
    reputation_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger to create user stats when new user is created
CREATE TRIGGER IF NOT EXISTS create_user_stats
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_stats (user_id)
    VALUES (NEW.id);
END;




------------------------------------------
-- Course Management Tables
------------------------------------------
-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10, 2),
    duration TEXT,
    level TEXT,
    instructor_id TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- Create course sections table
CREATE TABLE IF NOT EXISTS course_sections (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create course lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration TEXT,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES course_sections(id)
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    enrolled_at TEXT NOT NULL,
    status TEXT NOT NULL,
    progress DECIMAL(5, 2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

------------------------------------------
-- Contact Management
------------------------------------------
-- Create contact_us table
CREATE TABLE IF NOT EXISTS contact_us (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

------------------------------------------
-- Forum Tables
------------------------------------------
-- Forum Categories Table
CREATE TABLE IF NOT EXISTS forum_categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Forum Sub-Categories Table
CREATE TABLE IF NOT EXISTS forum_subcategories (
    id INTEGER PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE
);

-- Forum Topics Table
CREATE TABLE IF NOT EXISTS forum_topics (
    id INTEGER PRIMARY KEY,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES forum_subcategories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Forum Posts (Replies) Table with nested reply support
CREATE TABLE IF NOT EXISTS forum_posts (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    author_id TEXT NOT NULL,
    parent_id INTEGER,
    depth INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);

-- Forum User Stats Table
CREATE TABLE IF NOT EXISTS forum_user_stats (
    user_id TEXT PRIMARY KEY,
    reputation INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    topics_count INTEGER DEFAULT 0,
    badge TEXT DEFAULT 'New Member',
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Forum User Activity Table
CREATE TABLE IF NOT EXISTS forum_user_activity (
    user_id TEXT PRIMARY KEY,
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

------------------------------------------
-- Triggers
------------------------------------------
-- Drop existing triggers
DROP TRIGGER IF EXISTS update_user_activity_on_post;
DROP TRIGGER IF EXISTS update_user_activity_on_topic;

-- Create post activity trigger
CREATE TRIGGER update_user_activity_on_post 
AFTER INSERT ON forum_posts 
FOR EACH ROW 
BEGIN 
    REPLACE INTO forum_user_activity (user_id, last_active_at) 
    VALUES (new.author_id, CURRENT_TIMESTAMP);
END;

-- Create topic activity trigger
CREATE TRIGGER update_user_activity_on_topic 
AFTER INSERT ON forum_topics 
FOR EACH ROW 
BEGIN 
    REPLACE INTO forum_user_activity (user_id, last_active_at) 
    VALUES (new.author_id, CURRENT_TIMESTAMP);
END;

------------------------------------------
-- Views
------------------------------------------
-- Create forum statistics view
CREATE VIEW IF NOT EXISTS forum_statistics AS
SELECT
    (SELECT COUNT(*) FROM forum_topics WHERE is_deleted = FALSE) as total_topics,
    (SELECT COUNT(*) FROM forum_posts) as total_posts,
    (SELECT COUNT(*) FROM forum_user_activity 
     WHERE last_active_at >= datetime('now', '-15 minutes')) as active_users,
    (SELECT user_id FROM forum_user_activity 
     ORDER BY last_active_at DESC LIMIT 1) as latest_member;


-- Add to your schema.sql file
-- Forum Attachments Table
CREATE TABLE IF NOT EXISTS forum_attachments (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Topic Attachments Junction Table
CREATE TABLE IF NOT EXISTS forum_topic_attachments (
    topic_id INTEGER NOT NULL,
    attachment_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (topic_id, attachment_id),
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (attachment_id) REFERENCES forum_attachments(id) ON DELETE CASCADE
);

-- Reply Attachments Junction Table
CREATE TABLE IF NOT EXISTS forum_reply_attachments (
    reply_id INTEGER NOT NULL,
    attachment_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reply_id, attachment_id),
    FOREIGN KEY (reply_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (attachment_id) REFERENCES forum_attachments(id) ON DELETE CASCADE
);



-- Forum Reply Reactions Table
CREATE TABLE IF NOT EXISTS forum_post_reactions (
    id INTEGER PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL CHECK(reaction_type IN ('like', 'helpful', 'insightful', 'funny')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(post_id, user_id, reaction_type)
);


-- analytics schema
CREATE TABLE IF NOT EXISTS forum_reaction_analytics (
    id INTEGER PRIMARY KEY,
    post_id INTEGER NOT NULL,
    reaction_type TEXT NOT NULL,
    reaction_count INTEGER NOT NULL,
    trending_score FLOAT,
    time_period TEXT NOT NULL, -- 'hourly', 'daily', 'weekly'
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);



------------------------------------------
-- Indexes
------------------------------------------
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_subcategory ON forum_topics(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_user_stats_reputation ON forum_user_stats(reputation);
CREATE INDEX IF NOT EXISTS idx_user_activity_last_active ON forum_user_activity(last_active_at);
CREATE INDEX IF NOT EXISTS idx_attachments_user ON forum_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_attachments ON forum_topic_attachments(topic_id);
CREATE INDEX IF NOT EXISTS idx_reply_attachments ON forum_reply_attachments(reply_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent ON forum_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions ON forum_post_reactions(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_reaction_analytics_time 
ON forum_reaction_analytics(time_period, timestamp);