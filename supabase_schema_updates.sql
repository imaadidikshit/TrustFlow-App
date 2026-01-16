-- ================================================
-- TrustFlow Database Schema Updates
-- Video Studio & Widget Presets Support
-- Run this AFTER the initial schema setup
-- ================================================

-- 1. Add video_metadata column to testimonials table
-- This stores duration, aspect ratio, and edit history
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS video_metadata JSONB DEFAULT NULL;

-- 2. Add preset tracking to widget_configurations
-- Note: The 'settings' JSONB column already exists
-- Presets will be stored as { presetId: 'preset-id', ...settings }

-- 3. Add respondent_role column if not exists
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS respondent_role TEXT DEFAULT NULL;

-- 4. Add updated_at column to testimonials
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Create index for faster video testimonial queries
CREATE INDEX IF NOT EXISTS idx_testimonials_type_video 
ON public.testimonials(type) 
WHERE type = 'video';

-- 6. Create widget_configurations table if not exists
-- (This should already exist, but just in case)
CREATE TABLE IF NOT EXISTS public.widget_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Add attached_photos column to testimonials (for image testimonials)
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS attached_photos TEXT[] DEFAULT '{}';

-- 8. Create storage bucket for testimonial videos (if not exists)
-- Run this in Supabase Dashboard -> Storage -> Create Bucket:
-- Bucket name: testimonial_videos
-- Public: true

-- 9. Storage policies for testimonial_videos bucket
-- Enable RLS on storage.objects if not already done
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload videos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Allow video uploads' 
        AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Allow video uploads" ON storage.objects
            FOR INSERT WITH CHECK (
                bucket_id = 'testimonial_videos' 
                AND auth.role() = 'authenticated'
            );
    END IF;
END $$;

-- Policy: Allow public video reads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Allow public video reads' 
        AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Allow public video reads" ON storage.objects
            FOR SELECT USING (bucket_id = 'testimonial_videos');
    END IF;
END $$;

-- Policy: Allow owners to delete videos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Allow video deletions' 
        AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Allow video deletions" ON storage.objects
            FOR DELETE USING (
                bucket_id = 'testimonial_videos' 
                AND auth.role() = 'authenticated'
            );
    END IF;
END $$;

-- 10. Enable RLS on widget_configurations
ALTER TABLE public.widget_configurations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view widget configurations (for public wall)
CREATE POLICY IF NOT EXISTS "Anyone can view widget configs" ON public.widget_configurations
    FOR SELECT USING (true);

-- Policy: Space owners can manage widget configurations
CREATE POLICY IF NOT EXISTS "Space owners can manage widget configs" ON public.widget_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.spaces 
            WHERE spaces.id = widget_configurations.space_id 
            AND spaces.owner_id = auth.uid()
        )
    );

-- 11. Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Add trigger for testimonials updated_at
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Add trigger for widget_configurations updated_at
DROP TRIGGER IF EXISTS update_widget_configs_updated_at ON public.widget_configurations;
CREATE TRIGGER update_widget_configs_updated_at
    BEFORE UPDATE ON public.widget_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VERIFICATION QUERIES
-- Run these to verify the schema is correct
-- ================================================

-- Check testimonials columns:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'testimonials' ORDER BY ordinal_position;

-- Check widget_configurations:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'widget_configurations' ORDER BY ordinal_position;

-- Check storage buckets:
-- SELECT name, public FROM storage.buckets;

-- ================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- ================================================

-- Insert sample widget preset config (for testing):
-- INSERT INTO public.widget_configurations (space_id, settings)
-- VALUES (
--     'your-space-id-here',
--     '{
--         "presetId": "dark-glass",
--         "layout": "grid",
--         "theme": "dark",
--         "cardTheme": "dark",
--         "corners": "round",
--         "shadow": "strong",
--         "showHeading": true,
--         "headingText": "What customers say"
--     }'
-- )
-- ON CONFLICT (space_id) DO UPDATE SET settings = EXCLUDED.settings;
