import React, { useState } from 'react';

// Interfaz para datos de Pokémon real y troll
interface PokemonType {
	slot: number;
	type: {
		name: string;
		url: string;
	};
}

interface PokemonSprites {
	front_default: string;
}

interface PokemonData {
	id?: number;
	name: string;
	sprites?: PokemonSprites;
	types?: PokemonType[];
	reason?: string;
	warning?: string;
}
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Result from './components/Result';

function App() {
	const [searchedPokemon, setSearchedPokemon] = useState<string>('');
	const [showResult, setShowResult] = useState<boolean>(false);
	const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [trollStep, setTrollStep] = useState<'troll' | 'confirm'>('troll');

	// Usar variable de entorno para la URL de la API
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

	// Busca el modo troll (Gemini)
	const handleSearch = async (pokemon: string) => {
		setSearchedPokemon(pokemon);
		setShowResult(true);
		setLoading(true);
		setError(null);
		setPokemonData(null);
		setTrollStep('troll');
		try {
			const response = await fetch(`${API_URL}/pokemon/${pokemon}`);
			if (!response.ok) {
				throw new Error('No se encontró el Pokémon o error en el servidor');
			}
			const data = await response.json();
			setPokemonData(data);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Error desconocido');
			}
		} finally {
			setLoading(false);
		}
	};

	// Al pulsar el botón, vuelve a buscar troll o muestra el real si ya se confirmó
	const handleSearchReal = async (pokemon: string) => {
		if (trollStep === 'troll') {
			// Volver a mostrar troll, pero pidiendo warning IA
			setLoading(true);
			setError(null);
			setPokemonData(null);
			setTrollStep('confirm');
			try {
				// Enviamos un query param especial para que el backend genere el warning
				const response = await fetch(`${API_URL}/pokemon/${pokemon}?warning=1`);
				if (!response.ok) {
					throw new Error('No se encontró el Pokémon o error en el servidor');
				}
				const data = await response.json();
				setPokemonData(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Error desconocido');
				}
			} finally {
				setLoading(false);
			}
		} else {
			// Ahora sí, mostrar el real
			setLoading(true);
			setError(null);
			setPokemonData(null);
			try {
				const response = await fetch(`${API_URL}/pokemon/${pokemon}?real=true`);
				if (!response.ok) {
					throw new Error('No se encontró el Pokémon real o error en el servidor');
				}
				const data = await response.json();
				setPokemonData(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Error desconocido');
				}
			} finally {
				setLoading(false);
				setTrollStep('troll');
			}
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'>
			<div className='container mx-auto px-6 py-12'>
				{/* Header Component */}
				<Header />

				{/* Search Bar Component */}
				<SearchBar onSearch={handleSearch} />

				{/* Mensaje de carga o error */}
				{loading && <div className='text-center my-4 text-blue-700 font-bold'>Cargando...</div>}
				{error && <div className='text-center my-4 text-red-600 font-bold'>{error}</div>}

				{/* Result Component */}
				<Result
					searchedPokemon={searchedPokemon}
					isVisible={showResult}
					pokemonData={pokemonData}
					onSearchReal={handleSearchReal}
					trollStep={trollStep}
				/>

				{/* Footer divertido */}
				<footer className='text-center mt-16'>
					<p className='text-lg font-semibold text-gray-600 bg-white inline-block px-6 py-3 rounded-full shadow-md border-2 border-gray-300'>
						Desarrollado con 💜 y mucho trolleo
					</p>
				</footer>
			</div>
		</div>
	);
}

export default App;
