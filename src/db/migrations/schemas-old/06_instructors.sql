-- 06_instructors.sql

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    bio TEXT,
    contact_number TEXT,
    address TEXT,
    profile_image_url TEXT,
    specialization TEXT,
    qualification TEXT,
    years_of_experience INTEGER,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    social_links TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create instructor indexes
CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors(email);
CREATE INDEX IF NOT EXISTS idx_instructors_status ON instructors(status);
CREATE INDEX IF NOT EXISTS idx_instructors_rating ON instructors(rating);

-- Create trigger for instructors updated_at
CREATE TRIGGER IF NOT EXISTS trig_instructors_updated_at 
AFTER UPDATE ON instructors 
FOR EACH ROW 
WHEN NEW.updated_at <= OLD.updated_at
BEGIN 
    UPDATE instructors SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;