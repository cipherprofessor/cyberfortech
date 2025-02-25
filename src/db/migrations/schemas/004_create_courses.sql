-- Description: Creates courses and related tables including enrollments and reviews
-- Version: 4
-- Depends on: 003_create_instructors.sql
-- src/db/migrations/schemas/004_create_courses.sql
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
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    enrollment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    average_rating DECIMAL(3,1) DEFAULT 0,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'dropped', 'refunded')) DEFAULT 'active',
    progress DECIMAL(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMP,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
);

-- Create course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, course_id)
);

-- Create course content tables
CREATE TABLE IF NOT EXISTS course_sections (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sequence_number INTEGER NOT NULL,
    is_free_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS course_lessons (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT CHECK (content_type IN ('video', 'article', 'quiz', 'assignment')),
    content_url TEXT,
    duration INTEGER,
    is_free_preview BOOLEAN DEFAULT FALSE,
    sequence_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES course_sections(id)
);


-- Create course_content table
CREATE TABLE IF NOT EXISTS course_content (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    course_demo_url TEXT,
    course_outline TEXT,  -- JSON field for course outline/syllabus
    learning_objectives TEXT[], -- Array of learning objectives
    prerequisites TEXT[],  -- Array of prerequisites
    target_audience TEXT,
    estimated_completion_time TEXT,
    course_materials TEXT, -- JSON field for downloadable materials
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Create lessons content table for structured lesson data
CREATE TABLE IF NOT EXISTS course_lesson_content (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('video', 'article', 'quiz', 'assignment')),
    video_url TEXT,
    article_content TEXT,
    quiz_data TEXT, -- JSON field for quiz questions and answers
    assignment_details TEXT, -- JSON field for assignment information
    additional_resources TEXT[], -- Array of resource URLs
    transcript TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id)
);

-- Create progress tracking table (Fixed the status column reference)
CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completion_status TEXT CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
    time_spent INTEGER, -- in seconds
    last_position INTEGER, -- for video content, last watched position
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id),
    UNIQUE(user_id, lesson_id)
);




-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_sections_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_sections_sequence ON course_sections(sequence_number);
CREATE INDEX IF NOT EXISTS idx_lessons_section ON course_lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_lessons_sequence ON course_lessons(sequence_number);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_content_course ON course_content(course_id);
CREATE INDEX IF NOT EXISTS idx_course_content_instructor ON course_content(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lesson_content_lesson ON course_lesson_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id); 

-- Drop existing triggers
DROP TRIGGER IF EXISTS trig_courses_updated_at;
DROP TRIGGER IF EXISTS trig_enrollments_updated_at;
DROP TRIGGER IF EXISTS trig_reviews_updated_at;
DROP TRIGGER IF EXISTS trig_sections_updated_at;
DROP TRIGGER IF EXISTS trig_lessons_updated_at;
DROP TRIGGER IF EXISTS trig_enrollment_count;
DROP TRIGGER IF EXISTS trig_instructor_students;
DROP TRIGGER IF EXISTS trig_course_rating;

-- Create updated_at triggers
CREATE TRIGGER trig_courses_updated_at
AFTER UPDATE ON courses
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
  UPDATE courses SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_enrollments_updated_at
AFTER UPDATE ON enrollments
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
  UPDATE enrollments SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_reviews_updated_at
AFTER UPDATE ON course_reviews
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
  UPDATE course_reviews SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_sections_updated_at
AFTER UPDATE ON course_sections
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
  UPDATE course_sections SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_lessons_updated_at
AFTER UPDATE ON course_lessons
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
  UPDATE course_lessons SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;


-- Create triggers for updated_at
CREATE TRIGGER trig_course_content_updated_at
AFTER UPDATE ON course_content
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at)
BEGIN
    UPDATE course_content SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_lesson_content_updated_at
AFTER UPDATE ON course_lesson_content
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at)
BEGIN
    UPDATE course_lesson_content SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER trig_lesson_progress_updated_at
AFTER UPDATE ON lesson_progress
FOR EACH ROW
WHEN (NEW.updated_at <= OLD.updated_at)
BEGIN
    UPDATE lesson_progress SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Create business logic triggers
CREATE TRIGGER trig_enrollment_count
AFTER INSERT ON enrollments
WHEN NEW.status = 'active'
BEGIN
  UPDATE courses 
  SET enrollment_count = enrollment_count + 1 
  WHERE id = NEW.course_id;
END;

CREATE TRIGGER trig_instructor_students
AFTER INSERT ON enrollments
WHEN NEW.status = 'active'
BEGIN
  UPDATE instructors 
  SET total_students = total_students + 1 
  WHERE id = (
    SELECT instructor_id 
    FROM courses 
    WHERE id = NEW.course_id
  );
END;

CREATE TRIGGER trig_course_rating
AFTER INSERT ON course_reviews
WHEN NOT NEW.is_deleted
BEGIN
  UPDATE courses 
  SET average_rating = (
    SELECT ROUND(AVG(rating), 1)
    FROM course_reviews
    WHERE course_id = NEW.course_id
    AND is_deleted = FALSE
  )
  WHERE id = NEW.course_id;
END;

-- At the end of 004_create_courses.sql, use:
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (4, '004_create_courses');