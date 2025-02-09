-- 07_courses.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS courses_new;
DROP TABLE IF EXISTS courses;

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration TEXT NOT NULL,
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    instructor_id TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    average_rating DECIMAL(3,1) DEFAULT 0,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Create course indexes
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);

-- Create trigger for courses updated_at
CREATE TRIGGER IF NOT EXISTS trig_courses_updated_at 
AFTER UPDATE ON courses 
FOR EACH ROW 
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE courses SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;