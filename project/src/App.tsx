import { useState } from 'react';
import { GraduationCap, Filter, X } from 'lucide-react';
import PreferencesForm from './components/PreferencesForm';
import RecommendationList from './components/RecommendationList';
import Chatbot from './components/Chatbot';
import { getRecommendations } from './services/recommendationService';
import type { CollegeRecommendation, UserPreferences } from './types';

function App() {
  const [recommendations, setRecommendations] = useState<CollegeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPercentile, setUserPercentile] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRecommendations, setFilteredRecommendations] = useState<CollegeRecommendation[]>([]);
  const [filters, setFilters] = useState({
    safetyLevel: 'all',
    collegeType: 'all',
    maxFees: '',
  });

  const handleSearch = async (preferences: UserPreferences) => {
    setIsLoading(true);
    setUserPercentile(preferences.percentile);
    try {
      const results = await getRecommendations(preferences);
      setRecommendations(results);
      setFilteredRecommendations(results);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert('Error fetching recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recommendations];

    if (filters.safetyLevel !== 'all') {
      filtered = filtered.filter(rec => rec.safetyLevel === filters.safetyLevel);
    }

    if (filters.collegeType !== 'all') {
      filtered = filtered.filter(rec => rec.college.type === filters.collegeType);
    }

    if (filters.maxFees) {
      filtered = filtered.filter(rec => rec.program.fees_per_year <= parseFloat(filters.maxFees));
    }

    setFilteredRecommendations(filtered);
  };

  const resetFilters = () => {
    setFilters({
      safetyLevel: 'all',
      collegeType: 'all',
      maxFees: '',
    });
    setFilteredRecommendations(recommendations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                MHT-CET College Predictor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Find the best engineering colleges based on your percentile and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PreferencesForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            {recommendations.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                </button>

                {showFilters && (
                  <div className="mt-4 bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Filter Results</h3>
                      <button
                        onClick={resetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Safety Level
                        </label>
                        <select
                          value={filters.safetyLevel}
                          onChange={(e) => setFilters({ ...filters, safetyLevel: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Levels</option>
                          <option value="Safe">Safe</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Reach">Reach</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          College Type
                        </label>
                        <select
                          value={filters.collegeType}
                          onChange={(e) => setFilters({ ...filters, collegeType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Types</option>
                          <option value="Government">Government</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Annual Fees
                        </label>
                        <input
                          type="number"
                          value={filters.maxFees}
                          onChange={(e) => setFilters({ ...filters, maxFees: e.target.value })}
                          placeholder="e.g., 150000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      onClick={applyFilters}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Finding best colleges for you...</p>
              </div>
            ) : (
              <RecommendationList
                recommendations={filteredRecommendations}
                userPercentile={userPercentile}
              />
            )}
          </div>
        </div>
      </main>

      <Chatbot />

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">
            MHT-CET College Recommendation System - Helping students make informed decisions
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
