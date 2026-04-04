import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { UserPreferences, District } from '../types';
import { getDistricts, getBranches } from '../services/recommendationService';

interface PreferencesFormProps {
  onSearch: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

export default function PreferencesForm({ onSearch, isLoading }: PreferencesFormProps) {
  const [percentile, setPercentile] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    const [districtsData, branchesData] = await Promise.all([
      getDistricts(),
      getBranches(),
    ]);
    setDistricts(districtsData);
    setBranches(branchesData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!percentile || parseFloat(percentile) < 0 || parseFloat(percentile) > 100) {
      alert('Please enter a valid percentile between 0 and 100');
      return;
    }

    onSearch({
      percentile: parseFloat(percentile),
      preferredDistricts: selectedDistricts,
      maxBudget: maxBudget ? parseFloat(maxBudget) : null,
      preferredBranches: selectedBranches,
    });
  };

  const toggleDistrict = (districtName: string) => {
    setSelectedDistricts(prev =>
      prev.includes(districtName)
        ? prev.filter(d => d !== districtName)
        : [...prev, districtName]
    );
  };

  const toggleBranch = (branch: string) => {
    setSelectedBranches(prev =>
      prev.includes(branch)
        ? prev.filter(b => b !== branch)
        : [...prev, branch]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          MHT-CET Percentile *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={percentile}
          onChange={(e) => setPercentile(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your percentile (e.g., 95.5)"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Annual Budget (Optional)
        </label>
        <input
          type="number"
          step="1000"
          min="0"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter maximum fees per year (e.g., 150000)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Districts (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {districts.map((district) => (
            <label key={district.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDistricts.includes(district.name)}
                onChange={() => toggleDistrict(district.name)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{district.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Branches (Optional)
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {branches.map((branch) => (
            <label key={branch} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBranches.includes(branch)}
                onChange={() => toggleBranch(branch)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{branch}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <Search className="w-5 h-5" />
        <span>{isLoading ? 'Searching...' : 'Find Colleges'}</span>
      </button>
    </form>
  );
}
