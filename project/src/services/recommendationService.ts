import { supabase } from '../lib/supabase';
import type { CollegeRecommendation, UserPreferences } from '../types';

export async function getRecommendations(
  preferences: UserPreferences
): Promise<CollegeRecommendation[]> {
  const { percentile, preferredDistricts, maxBudget, preferredBranches } = preferences;

  let query = supabase
    .from('cutoffs')
    .select(`
      *,
      program:programs (
        *,
        college:colleges (
          *,
          district:districts (*)
        )
      )
    `)
    .eq('year', 2024)
    .eq('round', 1)
    .eq('category', 'OPEN')
    .lte('percentile', percentile + 5);

  const { data: cutoffsData, error } = await query;

  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }

  if (!cutoffsData) return [];

  const recommendations: CollegeRecommendation[] = cutoffsData
    .map((cutoff: any) => {
      const program = cutoff.program;
      const college = program?.college;
      const district = college?.district;

      if (!program || !college || !district) return null;

      if (maxBudget && program.fees_per_year > maxBudget) return null;

      if (preferredBranches.length > 0 && !preferredBranches.includes(program.branch)) {
        return null;
      }

      const percentileDiff = percentile - cutoff.percentile;
      let safetyLevel: 'Safe' | 'Moderate' | 'Reach';

      if (percentileDiff >= 3) safetyLevel = 'Safe';
      else if (percentileDiff >= 1) safetyLevel = 'Moderate';
      else safetyLevel = 'Reach';

      let matchScore = 0;

      if (percentileDiff >= 5) matchScore += 40;
      else if (percentileDiff >= 3) matchScore += 30;
      else if (percentileDiff >= 1) matchScore += 20;
      else matchScore += 10;

      if (preferredDistricts.includes(district.name)) {
        matchScore += 25;
      }

      if (college.type === 'Government') {
        matchScore += 15;
      }

      if (preferredBranches.includes(program.branch)) {
        matchScore += 20;
      }

      return {
        college,
        program,
        cutoff,
        district,
        matchScore,
        safetyLevel,
      };
    })
    .filter((rec): rec is CollegeRecommendation => rec !== null)
    .sort((a, b) => b.matchScore - a.matchScore);

  await supabase.from('user_queries').insert({
    percentile,
    preferred_districts: preferredDistricts,
    max_budget: maxBudget,
    preferred_branches: preferredBranches,
    results_count: recommendations.length,
  });

  return recommendations;
}

export async function getDistricts() {
  const { data, error } = await supabase
    .from('districts')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching districts:', error);
    return [];
  }

  return data || [];
}

export async function getBranches() {
  const { data, error } = await supabase
    .from('programs')
    .select('branch')
    .order('branch');

  if (error) {
    console.error('Error fetching branches:', error);
    return [];
  }

  const uniqueBranches = [...new Set(data?.map(p => p.branch) || [])];
  return uniqueBranches;
}
