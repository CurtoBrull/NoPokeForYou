import React from 'react';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-yellow-400 p-3 rounded-full shadow-lg">
          <Zap className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 drop-shadow-lg">
          Pokédex Troll
        </h1>
        <div className="bg-red-500 p-3 rounded-full shadow-lg">
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-700 bg-yellow-200 inline-block px-6 py-3 rounded-full shadow-md border-4 border-yellow-400">
        ¡Nunca recibirás el Pokémon que pides! 🎪
      </p>
    </header>
  );
};

export default Header;