-- Create interview_experiences table
CREATE TABLE IF NOT EXISTS interview_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name VARCHAR(255) NOT NULL,
    linkedin_url TEXT NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    interview_dates JSONB DEFAULT '[]'::jsonb,
    phone_screens INTEGER DEFAULT 0,
    technical_interviews INTEGER DEFAULT 0,
    behavioral_interviews INTEGER DEFAULT 0,
    other_interviews INTEGER DEFAULT 0,
    interview_questions TEXT NOT NULL,
    advice_tips TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_interview_experiences_company ON interview_experiences(company);
CREATE INDEX IF NOT EXISTS idx_interview_experiences_status ON interview_experiences(status);
CREATE INDEX IF NOT EXISTS idx_interview_experiences_created_at ON interview_experiences(created_at DESC);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_interview_experiences_questions_fts ON interview_experiences USING gin(to_tsvector('english', interview_questions));
CREATE INDEX IF NOT EXISTS idx_interview_experiences_tips_fts ON interview_experiences USING gin(to_tsvector('english', advice_tips));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_interview_experiences_updated_at ON interview_experiences;
CREATE TRIGGER update_interview_experiences_updated_at
    BEFORE UPDATE ON interview_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE interview_experiences ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only approved entries)
CREATE POLICY "Public can view approved entries" ON interview_experiences
    FOR SELECT
    USING (status = 'approved');

-- Create policy for public insert (submissions)
CREATE POLICY "Anyone can submit entries" ON interview_experiences
    FOR INSERT
    WITH CHECK (status = 'pending');

-- Note: Admin operations will use the service role key which bypasses RLS
