-- Users Schema - Core user management system
CREATE TABLE IF NOT EXISTS users (
    -- Core Clerk Fields
    id TEXT PRIMARY KEY,                    
    email TEXT,                            
    username TEXT UNIQUE,                   
    first_name TEXT,                        
    last_name TEXT,                         
    full_name TEXT,                         
    avatar_url TEXT,                        
    
    -- Role and Status
    role TEXT CHECK(role IN ('student', 'instructor', 'admin', 'superadmin')) NOT NULL DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Profile Fields
    bio TEXT,                              
    location TEXT,                         
    website TEXT,                          
    social_links TEXT CHECK (json_valid(social_links) OR social_links IS NULL),
    
    -- Timestamps and Status
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,                   
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Additional Metadata
    clerk_metadata TEXT CHECK (json_valid(clerk_metadata) OR clerk_metadata IS NULL),
    custom_metadata TEXT CHECK (json_valid(custom_metadata) OR custom_metadata IS NULL)
);

-- User Stats Table
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

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY,
    notification_preferences TEXT CHECK (json_valid(notification_preferences) OR notification_preferences IS NULL),
    privacy_settings TEXT CHECK (json_valid(privacy_settings) OR privacy_settings IS NULL),
    theme_preferences TEXT CHECK (json_valid(theme_preferences) OR theme_preferences IS NULL),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_active ON user_stats(last_active_at);