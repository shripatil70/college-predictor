export interface District {
  id: string;
  name: string;
  region: string | null;
}

export interface College {
  id: string;
  name: string;
  code: string | null;
  district_id: string;
  location: string | null;
  type: string | null;
  affiliation: string | null;
  facilities: Record<string, unknown>;
  contact_info: Record<string, unknown>;
}

export interface Program {
  id: string;
  college_id: string;
  branch: string;
  seats: number;
  fees_per_year: number;
  duration_years: number;
}

export interface Cutoff {
  id: string;
  program_id: string;
  year: number;
  round: number;
  category: string;
  percentile: number;
}

export interface CollegeRecommendation {
  college: College;
  program: Program;
  cutoff: Cutoff;
  district: District;
  matchScore: number;
  safetyLevel: 'Safe' | 'Moderate' | 'Reach';
}

export interface UserPreferences {
  percentile: number;
  preferredDistricts: string[];
  maxBudget: number | null;
  preferredBranches: string[];
}
