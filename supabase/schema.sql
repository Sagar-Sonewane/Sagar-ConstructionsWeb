-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. contact_requests table
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT
);

DROP TRIGGER IF EXISTS update_contact_requests_updated_at ON public.contact_requests;
CREATE TRIGGER update_contact_requests_updated_at 
BEFORE UPDATE ON public.contact_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    selected_service TEXT,
    preferred_date DATE,
    preferred_time TEXT,
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT
);

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at 
BEFORE UPDATE ON public.appointments 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    construction_type TEXT,
    plot_size TEXT,
    budget TEXT,
    address TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT
);

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at 
BEFORE UPDATE ON public.consultations 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. quotation_requests table
CREATE TABLE IF NOT EXISTS public.quotation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT,
    estimated_budget TEXT,
    plot_size TEXT,
    project_description TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT
);

DROP TRIGGER IF EXISTS update_quotation_requests_updated_at ON public.quotation_requests;
CREATE TRIGGER update_quotation_requests_updated_at 
BEFORE UPDATE ON public.quotation_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. buy_property_requests table
CREATE TABLE IF NOT EXISTS public.buy_property_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    preferred_location TEXT,
    budget TEXT,
    property_type TEXT,
    requirements TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT
);

DROP TRIGGER IF EXISTS update_buy_property_requests_updated_at ON public.buy_property_requests;
CREATE TRIGGER update_buy_property_requests_updated_at 
BEFORE UPDATE ON public.buy_property_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. sell_property_requests table
CREATE TABLE IF NOT EXISTS public.sell_property_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    property_type TEXT,
    property_location TEXT,
    area TEXT,
    expected_price TEXT,
    property_description TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT
);

DROP TRIGGER IF EXISTS update_sell_property_requests_updated_at ON public.sell_property_requests;
CREATE TRIGGER update_sell_property_requests_updated_at 
BEFORE UPDATE ON public.sell_property_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. uploaded_files table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    request_id UUID NOT NULL,
    request_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buy_property_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_property_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present
DROP POLICY IF EXISTS "Allow public inserts" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow public inserts" ON public.appointments;
DROP POLICY IF EXISTS "Allow public inserts" ON public.consultations;
DROP POLICY IF EXISTS "Allow public inserts" ON public.quotation_requests;
DROP POLICY IF EXISTS "Allow public inserts" ON public.buy_property_requests;
DROP POLICY IF EXISTS "Allow public inserts" ON public.sell_property_requests;
DROP POLICY IF EXISTS "Allow public inserts" ON public.uploaded_files;

DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.appointments;
DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.quotation_requests;
DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.buy_property_requests;
DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.sell_property_requests;
DROP POLICY IF EXISTS "Allow authenticated read/write" ON public.uploaded_files;

-- Create policies to allow public (anon) insertions only
CREATE POLICY "Allow public inserts" ON public.contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.quotation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.buy_property_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.sell_property_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON public.uploaded_files FOR INSERT WITH CHECK (true);

-- Create policies to allow authenticated users to perform all operations (Admins)
CREATE POLICY "Allow authenticated read/write" ON public.contact_requests TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON public.appointments TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON public.consultations TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON public.quotation_requests TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON public.buy_property_requests TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON public.sell_property_requests TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read/write" ON public.uploaded_files TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket initialization SQL (inserts buckets if they do not exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('quotation-images', 'quotation-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('property-images', 'property-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Allow public read of storage objects" ON storage.objects;
CREATE POLICY "Allow public read of storage objects" ON storage.objects FOR SELECT USING (bucket_id IN ('quotation-images', 'property-images'));

