-- Hands For Homeless (HFH) - Database Schema
-- Supabase PostgreSQL Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Enums
CREATE TYPE user_role AS ENUM ('citizen', 'volunteer', 'donor', 'admin');
CREATE TYPE case_status AS ENUM ('pending', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE request_status AS ENUM ('pending', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE assignment_status AS ENUM ('assigned', 'accepted', 'completed', 'cancelled');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE donation_type AS ENUM ('monetary', 'item');
CREATE TYPE item_category AS ENUM ('food', 'clothing', 'hygiene', 'blankets', 'other');
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'pending_pickup', 'picked_up', 'distributed');
CREATE TYPE campaign_status AS ENUM ('active', 'completed', 'archived');

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role user_role NOT NULL DEFAULT 'citizen',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Volunteers Details Table (Linked to profile)
CREATE TABLE public.volunteers (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    skills TEXT[],
    availability TEXT, -- e.g., 'weekends', 'evenings', 'flexible'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Campaigns Table (Fundraising)
CREATE TABLE public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    raised_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    status campaign_status DEFAULT 'active' NOT NULL,
    image_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Cases Table (Reports of homeless individuals)
CREATE TABLE public.cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    location_lat NUMERIC(9, 6),
    location_lng NUMERIC(9, 6),
    condition TEXT, -- e.g., 'needs medical attention', 'cold weather exposure'
    photo_url TEXT,
    status case_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Assistance Requests Table (Requests for help)
CREATE TABLE public.assistance_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type item_category NOT NULL,
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    urgency urgency_level DEFAULT 'medium' NOT NULL,
    status request_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Case Assignments (Volunteers assigned to cases or requests)
CREATE TABLE public.case_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.assistance_requests(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE,
    status assignment_status DEFAULT 'assigned' NOT NULL,
    notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Ensure an assignment is linked to either a case report OR an assistance request, not both or neither
    CONSTRAINT assignment_target_check CHECK (
        (case_id IS NOT NULL AND request_id IS NULL) OR 
        (case_id IS NULL AND request_id IS NOT NULL)
    )
);

-- 7. Donations Table
CREATE TABLE public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for anonymous
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2), -- Null for item donations
    donation_type donation_type NOT NULL,
    item_name TEXT, -- Null for monetary donations
    item_category item_category,
    item_quantity INTEGER,
    pickup_address TEXT,
    pickup_time TIMESTAMP WITH TIME ZONE,
    status donation_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Validation constraints
    CONSTRAINT donation_type_fields_check CHECK (
        (donation_type = 'monetary' AND amount IS NOT NULL AND item_name IS NULL) OR
        (donation_type = 'item' AND amount IS NULL AND item_name IS NOT NULL AND item_category IS NOT NULL)
    )
);

-- Create profile update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistance_requests_updated_at BEFORE UPDATE ON public.assistance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_assignments_updated_at BEFORE UPDATE ON public.case_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Supabase auth integration
-- This function runs automatically when a user is created in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen'::user_role),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Volunteers Policies
CREATE POLICY "Volunteers are viewable by everyone" ON public.volunteers
    FOR SELECT USING (true);
CREATE POLICY "Volunteers can update their own profile details" ON public.volunteers
    FOR UPDATE USING (auth.uid() = id);

-- Campaigns Policies
CREATE POLICY "Campaigns are viewable by everyone" ON public.campaigns
    FOR SELECT USING (true);

-- Cases Policies
CREATE POLICY "Cases are viewable by authenticated users" ON public.cases
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can report a case" ON public.cases
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Reporters can update their pending cases" ON public.cases
    FOR UPDATE USING (auth.uid() = reporter_id AND status = 'pending');

-- Assistance Requests Policies
CREATE POLICY "Assistance requests are viewable by authenticated users" ON public.assistance_requests
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create assistance requests" ON public.assistance_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can edit/delete their own pending requests" ON public.assistance_requests
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Case Assignments Policies
CREATE POLICY "Assignments are viewable by assigned volunteers and admins" ON public.case_assignments
    FOR SELECT USING (
        auth.uid() = volunteer_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Donations Policies
CREATE POLICY "Donors can view their own donations" ON public.donations
    FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Anyone can make a donation" ON public.donations
    FOR INSERT WITH CHECK (true);
