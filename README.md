# PrintVerse Technologies

3D Printing Startup - "Where Every Idea Takes Shape"

## Project Structure

This project implements the design system and database schema for PrintVerse Technologies with the following specifications:

### Brand Colors
- Primary: Deep Navy Blue (#0B1F4D)
- Accent: Red (#C41E2C) 
- Gold/Amber Highlight: (#D4A017)
- Background: Clean White

### Design System
- Card-based layouts with rounded corners and subtle shadows
- Bold confident headings
- Fully responsive design (mobile-first approach)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run database migrations:
   - Apply `db/orders_table.sql` to create the orders table
   - Apply `db/storage_bucket.sql` to set up the STL upload storage bucket

## Features Implemented

### Tailwind Configuration
- Custom color tokens for primary, accent, and gold colors
- Responsive design with mobile-first approach
- Card-based layout styling

### Supabase Integration
- Server-side client in `/lib/supabase/serverClient.ts`
- Browser-side client in `/lib/supabase/browserClient.ts`
- Orders table with all specified columns and constraints
- STL upload storage bucket with appropriate RLS policies

## Database Schema

### Orders Table
- `id`: UUID (primary key)
- `tracking_id`: Unique text identifier (e.g., TRK-8F3K2)
- `customer_name`: Text
- `email`: Text
- `phone`: Text (nullable)
- `stl_file_url`: Text (nullable, must be .stl files)
- `message`: Text
- `status`: Enum with values: Requested, Contacted, Quoted, Payment Pending, Paid, Printing, Shipped, Completed, Cancelled
- `quoted_price`: Numeric (nullable)
- `payment_link`: Text (nullable)
- `paid_at`: Timestamp (nullable)
- `created_at`: Timestamp (not null)
- `updated_at`: Timestamp (not null)

### Storage Bucket
- `stl-uploads` bucket with public insert access and admin-only read/list access