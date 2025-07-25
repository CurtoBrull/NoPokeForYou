import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (pokemon: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe el nombre de un Pokémon... (ej: Pikachu)"
              className="w-full px-6 py-4 text-xl font-semibold rounded-2xl border-4 border-blue-500 bg-white shadow-inner-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-300 transition-all duration-300 placeholder-gray-400 text-gray-800"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-7 h-7" />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-xl rounded-2xl shadow-2xl hover:from-red-700 hover:to-red-900 transform hover:scale-105 transition-all duration-300 border-4 border-red-400 flex items-center gap-2 active:scale-95 animate-pulse-once"
          >
            <Sparkles className="w-6 h-6" />
            ¡Sorpréndeme!
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
