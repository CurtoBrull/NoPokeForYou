import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Result from './components/Result';

function App() {
  const [searchedPokemon, setSearchedPokemon] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSearch = (pokemon: string) => {
    setSearchedPokemon(pokemon);
    setShowResult(true);
    
    // TODO: Aquí se implementará la lógica de llamada a la API
    // Por ahora solo mostramos el resultado troll
    console.log('Buscando:', pokemon);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="container mx-auto px-6 py-12">
        {/* Header Component */}
        <Header />
        
        {/* Search Bar Component */}
        <SearchBar onSearch={handleSearch} />
        
        {/* Result Component */}
        <Result 
          searchedPokemon={searchedPokemon} 
          isVisible={showResult} 
        />
        
        {/* Footer divertido */}
        <footer className="text-center mt-16">
          <p className="text-lg font-semibold text-gray-600 bg-white inline-block px-6 py-3 rounded-full shadow-md border-2 border-gray-300">
            Desarrollado con 💜 y mucho trolleo
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;