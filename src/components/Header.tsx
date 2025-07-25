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
          No Poke for You
        </h1>
        <div className="bg-red-500 p-3 rounded-full shadow-lg">
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      <p className="text-2xl font-black text-yellow-800 bg-yellow-300 inline-block px-8 py-3 rounded-full shadow-xl border-4 border-yellow-500 transform -rotate-2 hover:rotate-0 transition-transform duration-300 ease-in-out">
        ¡Nunca recibirás el Pokémon que pides!
      </p>
    </header>
  );
};

export default Header;
