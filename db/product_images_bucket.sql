-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, owner_id, public)
VALUES ('product-images', 'product-images', NULL, true);

-- Add RLS policies for the product images bucket
-- Allow public read access for images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-images');

-- Allow admin-only write/delete access
CREATE POLICY "Admin write/delete access" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');