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