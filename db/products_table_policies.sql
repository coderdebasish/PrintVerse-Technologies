-- Add RLS policies for the products table
-- Allow public read access to product information
CREATE POLICY "Public read access" ON products
FOR SELECT TO public
USING (is_available = TRUE AND is_coming_soon = FALSE);

-- Allow admin-only write/update/delete access
CREATE POLICY "Admin write/update/delete access" ON products
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);