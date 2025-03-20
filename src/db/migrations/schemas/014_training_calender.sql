-- src/db/migrations/schemas/006_create_training_courses.sql
-- Description: Creates training course structure including courses and enrollments
-- Version: 6
-- Depends on: 005_create_forum_base.sql

-- Create training courses table
CREATE TABLE IF NOT EXISTS training_courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    dates TEXT NOT NULL,
    time TEXT NOT NULL,
    duration TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('online', 'in-person', 'hybrid')),
    location TEXT,
    instructor TEXT NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_enrollment INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT NOT NULL,
    prerequisites TEXT,
    certification TEXT,
    language TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS training_enrollments (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_id TEXT,
    payment_amount DECIMAL(10, 2),
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    completion_date DATETIME,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    certificate_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    FOREIGN KEY (course_id) REFERENCES training_courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(course_id, user_id, is_deleted)
);

-- Create course waitlist table
CREATE TABLE IF NOT EXISTS training_waitlist (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'enrolled', 'expired')),
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (course_id) REFERENCES training_courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(course_id, user_id, is_deleted)
);

-- Create course instructors table for future extension
CREATE TABLE IF NOT EXISTS training_instructors (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    bio TEXT,
    expertise TEXT,
    profile_image TEXT,
    contact_email TEXT,
    is_external BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create course categories table
CREATE TABLE IF NOT EXISTS training_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_courses_dates ON training_courses(dates);
CREATE INDEX IF NOT EXISTS idx_training_courses_level ON training_courses(level);
CREATE INDEX IF NOT EXISTS idx_training_courses_category ON training_courses(category);
CREATE INDEX IF NOT EXISTS idx_training_courses_active ON training_courses(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_training_enrollments_course ON training_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_user ON training_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_status ON training_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_training_waitlist_course ON training_waitlist(course_id);
CREATE INDEX IF NOT EXISTS idx_training_waitlist_user ON training_waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_training_instructors_user ON training_instructors(user_id);

-- Drop existing triggers
DROP TRIGGER IF EXISTS trig_training_courses_updated_at;
DROP TRIGGER IF EXISTS trig_training_enrollments_updated_at;
DROP TRIGGER IF EXISTS trig_training_waitlist_updated_at;
DROP TRIGGER IF EXISTS trig_training_instructors_updated_at;

-- Create triggers for updated_at timestamps
CREATE TRIGGER trig_training_courses_updated_at 
AFTER UPDATE ON training_courses 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE training_courses SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_training_enrollments_updated_at 
AFTER UPDATE ON training_enrollments 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE training_enrollments SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_training_waitlist_updated_at 
AFTER UPDATE ON training_waitlist 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE training_waitlist SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_training_instructors_updated_at 
AFTER UPDATE ON training_instructors 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE training_instructors SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Create trigger to update current_enrollment when a new enrollment is added
CREATE TRIGGER trig_update_course_enrollment_count_insert
AFTER INSERT ON training_enrollments
FOR EACH ROW
WHEN NEW.status = 'confirmed' AND NEW.is_deleted = FALSE
BEGIN
    UPDATE training_courses
    SET current_enrollment = current_enrollment + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.course_id;
END;

-- Create trigger to update current_enrollment when an enrollment is updated
CREATE TRIGGER trig_update_course_enrollment_count_update
AFTER UPDATE ON training_enrollments
FOR EACH ROW
WHEN (OLD.status != 'confirmed' AND NEW.status = 'confirmed' AND NEW.is_deleted = FALSE) OR
     (OLD.status = 'confirmed' AND NEW.status != 'confirmed' AND NEW.is_deleted = FALSE) OR
     (OLD.status = 'confirmed' AND OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE)
BEGIN
    UPDATE training_courses
    SET current_enrollment = current_enrollment + 
        CASE 
            WHEN OLD.status != 'confirmed' AND NEW.status = 'confirmed' AND NEW.is_deleted = FALSE THEN 1
            WHEN (OLD.status = 'confirmed' AND NEW.status != 'confirmed' AND NEW.is_deleted = FALSE) OR
                 (OLD.status = 'confirmed' AND OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE) THEN -1
            ELSE 0
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.course_id;
END;

-- Insert version record
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (6, '006_create_training_courses');