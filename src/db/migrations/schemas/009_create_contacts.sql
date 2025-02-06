-- Description: Creates contact form functionality
-- Version: 9
-- Depends on: 008_create_forum_analytics.sql

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'in_progress', 'resolved', 'spam')),
    assigned_to TEXT,
    response TEXT,
    response_by TEXT,
    responded_at DATETIME,
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    tags TEXT CHECK (json_valid(tags) OR tags IS NULL),
    metadata TEXT CHECK (json_valid(metadata) OR metadata IS NULL),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (response_by) REFERENCES users(id)
);

-- Create contact history table
CREATE TABLE IF NOT EXISTS contact_history (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL,
    action TEXT NOT NULL,
    action_by TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (action_by) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_priority ON contacts(priority);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned ON contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_history_contact ON contact_history(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_history_action ON contact_history(action);

-- Drop existing trigger
DROP TRIGGER IF EXISTS trig_contacts_updated_at;
DROP TRIGGER IF EXISTS trig_contact_status_history;

-- Create trigger for updated_at
CREATE TRIGGER trig_contacts_updated_at 
AFTER UPDATE ON contacts 
FOR EACH ROW 
WHEN (NEW.updated_at <= OLD.updated_at OR NEW.updated_at IS NULL)
BEGIN
    UPDATE contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Create trigger to log status changes
CREATE TRIGGER trig_contact_status_history 
AFTER UPDATE ON contacts 
WHEN NEW.status != OLD.status
BEGIN
    INSERT INTO contact_history (
        id,
        contact_id,
        action,
        action_by,
        previous_status,
        new_status,
        created_at
    )
    VALUES (
        lower(hex(randomblob(16))),
        NEW.id,
        'status_change',
        NEW.assigned_to,
        OLD.status,
        NEW.status,
        CURRENT_TIMESTAMP
    );
END;

-- Insert version record
INSERT OR REPLACE INTO schema_versions (version, name) VALUES (9, '009_create_contacts');