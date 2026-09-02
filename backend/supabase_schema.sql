-- ==========================================
-- Hands For Homeless (HFH) - Supabase PostgreSQL Schema
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role TEXT DEFAULT 'citizen',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cases Table
CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    reporter_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    condition TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Case Assignments Table
CREATE TABLE IF NOT EXISTS case_assignments (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    volunteer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'accepted',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Assistance Requests Table
CREATE TABLE IF NOT EXISTS assistance_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    urgency TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_amount DOUBLE PRECISION NOT NULL,
    current_amount DOUBLE PRECISION DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY,
    donor_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL,
    donation_type TEXT NOT NULL,
    amount DOUBLE PRECISION,
    item_name TEXT,
    item_category TEXT,
    item_quantity INTEGER,
    pickup_address TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Insert Default Admin User (admin@test.com / admin123)
-- Password hash for 'admin123' using werkzeug pbkdf2/scrypt
INSERT INTO profiles (id, email, password_hash, full_name, role)
VALUES (
    'admin-root-id-001',
    'admin@test.com',
    'scrypt:32768:8:1$kQhM0qM1r6jK9U0A$9f24e93fb22ebba5a0d33896dfa428205562145e656c07aa887c4f45107ba5c8a49c4f03eeffcdcfec2792c30db432a58b5e9f8f4a1329dc3797686ff8c69784',
    'System Admin',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Disable Row Level Security (RLS) for Flask Backend service access
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
