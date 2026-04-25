-- Create the questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL,
  framework TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  experience TEXT NOT NULL,
  solution TEXT NOT NULL,
  options JSONB,
  "correctOption" INTEGER,
  "codeSnippet" TEXT,
  "codeLanguage" TEXT,
  "askCount" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags JSONB
);

-- Set up Row Level Security (RLS)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for this app (since it's a simple client-side app)
CREATE POLICY "Allow anonymous read access" ON questions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert access" ON questions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON questions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete access" ON questions FOR DELETE TO anon USING (true);
