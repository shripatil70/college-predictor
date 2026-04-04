/*
  # College Recommendation System Schema

  1. New Tables
    - `districts`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null) - District name
      - `region` (text) - Region classification (e.g., Vidarbha, Western Maharashtra)
      - `created_at` (timestamptz)
    
    - `colleges`
      - `id` (uuid, primary key)
      - `name` (text, not null) - College name
      - `code` (text, unique) - College code
      - `district_id` (uuid, foreign key to districts)
      - `location` (text) - City/area within district
      - `type` (text) - Type: Government, Private, Autonomous
      - `affiliation` (text) - University affiliation
      - `facilities` (jsonb) - Facilities like hostel, library, labs
      - `contact_info` (jsonb) - Phone, email, website
      - `created_at` (timestamptz)
    
    - `programs`
      - `id` (uuid, primary key)
      - `college_id` (uuid, foreign key to colleges)
      - `branch` (text, not null) - Engineering branch (e.g., Computer Science)
      - `seats` (integer) - Total seats
      - `fees_per_year` (numeric) - Annual fees
      - `duration_years` (integer, default 4)
      - `created_at` (timestamptz)
    
    - `cutoffs`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to programs)
      - `year` (integer, not null)
      - `round` (integer, not null) - CAP round number
      - `category` (text, not null) - OPEN, OBC, SC, ST, etc.
      - `percentile` (numeric, not null)
      - `created_at` (timestamptz)
    
    - `user_queries`
      - `id` (uuid, primary key)
      - `percentile` (numeric, not null)
      - `preferred_districts` (jsonb) - Array of district preferences
      - `max_budget` (numeric)
      - `preferred_branches` (jsonb) - Array of preferred branches
      - `results_count` (integer) - Number of recommendations returned
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for districts, colleges, programs, cutoffs (educational data)
    - Authenticated users can insert their own queries
*/

CREATE TABLE IF NOT EXISTS districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  region text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  district_id uuid REFERENCES districts(id),
  location text,
  type text DEFAULT 'Private',
  affiliation text,
  facilities jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES colleges(id) ON DELETE CASCADE,
  branch text NOT NULL,
  seats integer DEFAULT 60,
  fees_per_year numeric NOT NULL,
  duration_years integer DEFAULT 4,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cutoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  year integer NOT NULL,
  round integer NOT NULL,
  category text NOT NULL DEFAULT 'OPEN',
  percentile numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  percentile numeric NOT NULL,
  preferred_districts jsonb DEFAULT '[]',
  max_budget numeric,
  preferred_branches jsonb DEFAULT '[]',
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read districts"
  ON districts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read colleges"
  ON colleges FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read programs"
  ON programs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read cutoffs"
  ON cutoffs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert queries"
  ON user_queries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_colleges_district ON colleges(district_id);
CREATE INDEX IF NOT EXISTS idx_programs_college ON programs(college_id);
CREATE INDEX IF NOT EXISTS idx_programs_fees ON programs(fees_per_year);
CREATE INDEX IF NOT EXISTS idx_cutoffs_program ON cutoffs(program_id);
CREATE INDEX IF NOT EXISTS idx_cutoffs_percentile ON cutoffs(percentile);
CREATE INDEX IF NOT EXISTS idx_cutoffs_year ON cutoffs(year);