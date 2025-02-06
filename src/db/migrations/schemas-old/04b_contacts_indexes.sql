CREATE INDEX IF NOT EXISTS idx_contacts_status ON contact_us(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contact_us(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contact_us(assigned_to);