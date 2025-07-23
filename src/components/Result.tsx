import React from 'react';
import { Laugh, RefreshCw } from 'lucide-react';

interface ResultProps {
  searchedPokemon: string;
  isVisible: boolean;
}

const Result: React.FC<ResultProps> = ({ searchedPokemon, isVisible }) => {
  // Lista de respuestas troll divertidas
  const trollResponses = [
    "Snorlax (¡Porque necesitas dormir más!)",
    "Magikarp (¡El más poderoso de todos!)",
    "Ditto (¡Puede ser cualquier cosa, menos lo que pediste!)",
    "Psyduck (¡Tan confundido como tú ahora!)",
    "Slowpoke (¡Llega tarde, como siempre!)",
    "Bidoof (¡El verdadero maestro Pokémon!)",
    "Caterpie (¡Pequeño pero con grandes sueños!)",
    "Dunsparce (¡El más subestimado!)"
  ];

  const randomResponse = trollResponses[Math.floor(Math.random() * trollResponses.length)];

  if (!isVisible) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <div className="bg-gray-100 rounded-3xl p-12 border-4 border-dashed border-gray-300">
          <p className="text-xl font-semibold">
            Aquí aparecerá tu "sorpresa" Pokémon... 🎭
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-purple-400 shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Laugh className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl font-black text-purple-800">
              ¡RESULTADO TROLL! 🎪
            </h3>
            <Laugh className="w-8 h-8 text-purple-600" />
          </div>
          
          <div className="bg-white rounded-2xl p-6 border-3 border-purple-300 mb-4">
            <p className="text-lg font-semibold text-gray-600 mb-2">
              Pediste: <span className="text-blue-600 font-black">{searchedPokemon}</span>
            </p>
            <p className="text-lg font-semibold text-gray-600 mb-4">
              Pero obtuviste:
            </p>
            <p className="text-3xl font-black text-red-600 bg-yellow-200 inline-block px-4 py-2 rounded-xl border-2 border-yellow-400">
              {randomResponse}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
            <RefreshCw className="w-4 h-4" />
            <p className="font-semibold">
              {/* TODO: Aquí se implementará la lógica de llamada a la API */}
              ¡Inténtalo de nuevo para otra sorpresa!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;