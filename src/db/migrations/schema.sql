-- Enable foreign key support
PRAGMA foreign_keys = ON;

------------------------------------------
-- Core System Tables
------------------------------------------
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'instructor', 'admin')) NOT NULL DEFAULT 'student'
);

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

-- Forum Posts (Replies) Table
CREATE TABLE IF NOT EXISTS forum_posts (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id)
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

------------------------------------------
-- Indexes
------------------------------------------
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_subcategory ON forum_topics(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_user_stats_reputation ON forum_user_stats(reputation);
CREATE INDEX IF NOT EXISTS idx_user_activity_last_active ON forum_user_activity(last_active_at);