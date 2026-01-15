-- Migration: Add Categories System
-- Description: Creates categories table, seeds predefined categories, and adds category relationship to posts

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
-- Everyone can read categories
CREATE POLICY "categories_select_all"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update categories
CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete categories
CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seed predefined categories from navbar
INSERT INTO public.categories (name_en, name_bn, slug, description) VALUES
  ('Masala Masayel', 'মাসআলা মাসায়েল', 'masala-masayel', 'Islamic jurisprudence and rulings'),
  ('Quran''s Light', 'কোরআনের আলো', 'quraner-alo', 'Insights and reflections from the Quran'),
  ('Essays', 'প্রবন্ধ সমূহ', 'probondho-somuho', 'Thoughtful essays and articles'),
  ('Topic-based Discourse', 'বিষয়ভিত্তিক বয়ান', 'bishoy-bhittik-boyan', 'Lectures and discourses on specific topics'),
  ('Others', 'অন্যান্য', 'others', 'Miscellaneous content')
ON CONFLICT (slug) DO NOTHING;

-- Add category_id column to posts table
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Add excerpt column to posts table for post summaries
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add author_email column to posts table (for display purposes)
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS author_email TEXT;

-- Create index on category_id for fast filtering
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts(category_id);

-- Update existing posts to have a default category (Others)
UPDATE public.posts 
SET category_id = (SELECT id FROM public.categories WHERE slug = 'others' LIMIT 1)
WHERE category_id IS NULL;

-- Add trigger to update updated_at timestamp on categories
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();
