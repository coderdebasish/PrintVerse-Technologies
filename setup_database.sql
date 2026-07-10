-- Database setup for PrintVerse Technologies

-- Create orders table for PrintVerse Technologies
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tracking_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    stl_file_url TEXT,
    message TEXT,
    status TEXT CHECK (status IN (
        'Requested',
        'Contacted',
        'Quoted',
        'Payment Pending',
        'Paid',
        'Printing',
        'Shipped',
        'Completed',
        'Cancelled'
    )) NOT NULL,
    quoted_price NUMERIC(10, 2),
    payment_link TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_updated_at ON orders(updated_at);

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for STL uploads
INSERT INTO storage.buckets (id, name, owner_id, public)
VALUES ('stl-uploads', 'stl-uploads', NULL, true);

-- Add RLS policies for the storage bucket
-- Allow public insert for uploads
CREATE POLICY "Allow public upload" ON storage.objects
FOR INSERT TO public
WITH CHECK (
    bucket_id = 'stl-uploads' AND
    (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Allow admin-only read/list access
DROP POLICY IF EXISTS "Admin read/list only" ON storage.objects;

CREATE POLICY "Admin read/list only" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'stl-uploads');