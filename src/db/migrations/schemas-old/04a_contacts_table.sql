CREATE TABLE IF NOT EXISTS contact_us (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'in_progress', 'resolved', 'spam')),
    assigned_to TEXT,
    response TEXT,
    responded_at DATETIME,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);