import { MapPin, DollarSign, Users, Building2, Award, TrendingUp } from 'lucide-react';
import type { CollegeRecommendation } from '../types';

interface RecommendationListProps {
  recommendations: CollegeRecommendation[];
  userPercentile: number;
}

export default function RecommendationList({ recommendations, userPercentile }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">
          No colleges found matching your criteria. Try adjusting your preferences.
        </p>
      </div>
    );
  }

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'Safe':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Reach':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Found {recommendations.length} colleges for you</h3>
        <p className="text-sm text-blue-700">
          Colleges are ranked by match score based on your percentile ({userPercentile}%), location preferences, and other factors.
        </p>
      </div>

      {recommendations.map((rec, index) => (
        <div
          key={rec.program.id}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                  #{index + 1}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{rec.college.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{rec.program.branch}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSafetyColor(rec.safetyLevel)}`}>
                {rec.safetyLevel}
              </span>
              <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  {rec.matchScore}% Match
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                {rec.college.location}, {rec.district.name}
                {rec.district.region && ` (${rec.district.region})`}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{rec.college.type} College</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                ₹{rec.program.fees_per_year.toLocaleString('en-IN')}/year
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{rec.program.seats} seats</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-700">
              <Award className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                Cutoff: {rec.cutoff.percentile}% (2024, Round {rec.cutoff.round})
              </span>
            </div>

            {rec.college.affiliation && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{rec.college.affiliation}</span>
              </div>
            )}
          </div>

          {rec.college.facilities && Object.keys(rec.college.facilities).length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Facilities:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(rec.college.facilities).map(([key, value]) => (
                  value && (
                    <span
                      key={key}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                    >
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <strong>Your Chances:</strong>{' '}
                {rec.safetyLevel === 'Safe' && 'High probability of admission. This is a safe choice.'}
                {rec.safetyLevel === 'Moderate' && 'Good chances of admission. Consider this option.'}
                {rec.safetyLevel === 'Reach' && 'Competitive admission. Apply but also consider safer options.'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
