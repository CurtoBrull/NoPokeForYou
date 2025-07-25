import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

// Imagen de pokéball translúcida para fondo
const pokeBallBg = 'https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png';
const pokeballIcon = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg';

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

interface ResultProps {
	searchedPokemon: string;
	isVisible: boolean;
	pokemonData?: PokemonData | null;
	onSearchReal?: (pokemon: string) => void;
	trollStep?: 'troll' | 'confirm';
}

const Result: React.FC<ResultProps> = ({ searchedPokemon, isVisible, pokemonData, onSearchReal, trollStep }) => {
	// Estado para detalles del Pokémon troll (si hay que buscarlo)
	const [trollDetails, setTrollDetails] = useState<PokemonData | null>(null);
	const [loadingTroll, setLoadingTroll] = useState(false);

	// Si pokemonData tiene reason, es modo troll
	useEffect(() => {
		let cancelled = false;
		const maxRetries = 6;

		async function fetchValidTrollDetails(pokeName: string, tries = 0) {
			setTrollDetails(null);
			setLoadingTroll(true);
			let valid = false;
			let data: PokemonData | null = null;
			let currentName = pokeName;
			let retryCount = tries;
			while (!valid && retryCount < maxRetries && !cancelled) {
				try {
					const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(currentName.toLowerCase())}`);
					if (!res.ok) throw new Error('No encontrado');
					data = await res.json();
					valid = !!(data?.id && data?.sprites?.front_default && Array.isArray(data?.types) && data.types.length > 0);
					if (!valid) throw new Error('Datos incompletos');
				} catch {
					retryCount++;
					// Pedir otro troll al backend
					try {
						const trollRes = await fetch(`/api/pokemon/${searchedPokemon}`);
						const trollJson = await trollRes.json();
						// Si el nombre es igual al anterior, forzar otro intento
						if (trollJson.name && trollJson.name.toLowerCase() !== currentName.toLowerCase()) {
							currentName = trollJson.name;
						} else {
							if (retryCount < maxRetries) {
								await new Promise(res => setTimeout(res, 200));
								continue;
							} else {
								break;
							}
						}
					} catch {
						break;
					}
				}
			}
			if (!cancelled) {
				setTrollDetails(valid ? data : null);
				setLoadingTroll(false);
			}
		}

		if (pokemonData?.reason && pokemonData?.name) {
			fetchValidTrollDetails(pokemonData.name);
		} else {
			setTrollDetails(null);
			setLoadingTroll(false);
		}
		return () => {
			cancelled = true;
		};
	}, [pokemonData, searchedPokemon]);

	if (!isVisible) {
		return (
			<div className='text-center text-gray-500 mt-12'>
				<div
					className='relative bg-gradient-to-br from-yellow-100 to-blue-100 rounded-3xl p-12 border-4 border-dashed border-yellow-300 shadow-lg overflow-hidden'
					style={{ minHeight: 220 }}>
					<img
						src={pokeBallBg}
						alt='pokeball-bg'
						className='absolute opacity-10 w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none'
						draggable={false}
					/>
					<p className='text-2xl font-extrabold flex flex-col items-center text-yellow-700 drop-shadow-lg'>
						Aquí aparecerá tu <span className='text-yellow-600 font-black'>Pokémon</span> sorpresa...
					</p>
				</div>
			</div>
		);
	}

	// Modo real (PokéAPI)
	const isReal = !!pokemonData?.sprites;
	const isTroll = !!pokemonData?.reason;

	return (
		<div className='max-w-2xl mx-auto'>
			<div
				className='relative bg-gradient-to-br from-yellow-200 to-blue-200 rounded-3xl p-8 border-[8px] border-yellow-500 shadow-inner-xl overflow-hidden'
				style={{ minHeight: 500 }}>
				<img
					src={pokeBallBg}
					alt='pokeball-bg'
					className='absolute opacity-15 w-[420px] h-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none animate-pulse'
					draggable={false}
				/>
				<div className='text-center relative z-10'>
					<div className='mb-6'>
						<h3
							className='text-5xl font-black text-yellow-800 tracking-wide drop-shadow-lg uppercase mb-4'
							style={{ letterSpacing: 3, textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
							{isReal && '¡POKÉMON ENCONTRADO!'}
							{isTroll && !isReal && '¡RESULTADO TROLL!'}
							{!isReal && !isTroll && '¡Sorpresa!'}
						</h3>
						{isTroll && (
							<img src={pokeballIcon} alt='troll-pokeball' className='w-16 h-16 mx-auto mb-4 animate-bounce-slow' />
						)}
					</div>

					<div
						className={
							'rounded-3xl p-8 mb-6 shadow-xl flex flex-col items-center ' +
							(isTroll ? 'bg-yellow-100/95 border-[5px] border-yellow-400' : 'bg-white/90 border-[5px] border-blue-400')
						}>
						<p className='text-xl font-bold text-gray-700 mb-2'>
							Buscaste:{' '}
							<span className='text-blue-700 font-extrabold underline underline-offset-4'>{searchedPokemon}</span>
						</p>
						<p className='text-xl font-bold text-gray-700 mb-6'>
							{isReal && 'Y obtuviste:'}
							{isTroll && !isReal && 'Pero obtuviste:'}
							{!isReal && !isTroll && 'Resultado:'}
						</p>
						{isReal && (
							<div className='flex flex-col items-center gap-2'>
								{pokemonData.sprites?.front_default && (
									<div className='bg-gradient-to-br from-blue-300 to-blue-100 rounded-full border-4 border-blue-500 shadow-xl p-3 mb-2 relative transform rotate-3 hover:rotate-0 transition-transform duration-300 ease-in-out'>
										<img
											src={pokemonData.sprites.front_default}
											alt={pokemonData.name}
											className='w-40 h-40 drop-shadow-2xl animate-fade-in-up'
										/>
									</div>
								)}
								<div className='text-center'>
									<div>
										<span className='font-extrabold text-gray-800 text-2xl'>{pokemonData.name.toUpperCase()}</span>
									</div>
									{pokemonData.id && (
										<div>
											<span className='font-semibold text-gray-600'>ID:</span>{' '}
											<span className='text-blue-700 font-bold'>{pokemonData.id}</span>
										</div>
									)}
								</div>
								{pokemonData.types && Array.isArray(pokemonData.types) && (
									<div className='mb-2'>
										<span className='font-semibold text-gray-600'>Tipo(s):</span>{' '}
										<span className='font-bold text-blue-700'>
											{pokemonData.types.map(t => t.type.name.toUpperCase()).join(', ')}
										</span>
									</div>
								)}
							</div>
						)}
						{isTroll && (
							<div className='flex flex-col items-center text-xl text-gray-800 bg-yellow-50 p-6 rounded-2xl border-4 border-yellow-300 shadow-md w-full max-w-lg mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300 ease-in-out'>
								{/* Mensaje IA warning solo en el paso de confirmación */}
								{trollStep === 'confirm' && pokemonData.warning && (
									<div className='mb-6 p-4 rounded-xl bg-red-100 border-2 border-red-500 text-red-800 font-extrabold text-center shadow-lg animate-fade-in-down'>
										{pokemonData.warning}
									</div>
								)}
								{loadingTroll ? (
									<span className='italic text-gray-500 text-lg'>Cargando detalles del Pokémon troll...</span>
								) : trollDetails?.sprites?.front_default ? (
									<div className='bg-gradient-to-br from-yellow-300 to-yellow-100 rounded-full border-4 border-yellow-500 shadow-xl p-3 mb-2 relative transform -rotate-3 hover:rotate-0 transition-transform duration-300 ease-in-out'>
										<img
											src={trollDetails.sprites.front_default}
											alt={pokemonData.name}
											className='w-40 h-40 drop-shadow-2xl animate-spin-slow'
										/>
									</div>
								) : null}
								<div className='text-center'>
									<div>
										<span className='font-extrabold text-gray-800 text-2xl'>{pokemonData.name.toUpperCase()}</span>
									</div>
									{trollDetails?.id && (
										<div>
											<span className='font-semibold text-gray-600'>ID:</span>{' '}
											<span className='text-yellow-700 font-bold'>{trollDetails.id}</span>
										</div>
									)}
								</div>
								{trollDetails?.types && Array.isArray(trollDetails.types) && (
									<div className='mb-2'>
										<span className='font-semibold text-gray-600'>Tipo(s):</span>{' '}
										<span className='font-bold text-yellow-700'>
											{trollDetails.types.map(t => t.type.name.toUpperCase()).join(', ')}
										</span>
									</div>
								)}
								<div className='mb-2 w-full'>
									<div className='bg-yellow-200 border-l-8 border-yellow-600 rounded-xl p-5 shadow-inner-lg text-lg text-yellow-900 font-medium text-left'>
										<span className='font-extrabold text-yellow-800 block mb-1'>¡Motivo del troleo!</span>{' '}
										<span className='italic leading-relaxed'>{pokemonData.reason}</span>
									</div>
								</div>
								{!loadingTroll && !trollDetails && (
									<div className='text-base text-gray-500 mt-2'>No se encontraron detalles para este Pokémon.</div>
								)}
							</div>
						)}
						{!isReal && !isTroll && (
							<div className='text-red-600 font-bold text-xl'>No se encontró información del Pokémon.</div>
						)}
						{isTroll && onSearchReal && (
							<div className='mt-8 flex justify-center'>
								<button
									className={
										(trollStep === 'confirm'
											? 'bg-red-700 hover:bg-red-900 border-red-500'
											: 'bg-blue-600 hover:bg-blue-800 border-blue-400') +
										' text-white font-black py-4 px-10 rounded-full shadow-2xl text-xl tracking-wide border-4 hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-wiggle'
									}
									onClick={() => onSearchReal(searchedPokemon)}>
									{trollStep === 'confirm' ? '¡Quiero mi Pokémon real AHORA!' : 'Ver el Pokémon real'}
								</button>
							</div>
						)}
					</div>

					<div className='flex items-center justify-center gap-3 text-lg text-yellow-800 mt-8'>
						<RefreshCw className='w-6 h-6 animate-spin-slow' />
						<p className='font-extrabold text-shadow-sm'>
							{isReal
								? '¡Busca otro Pokémon para más información!'
								: isTroll
								? '¡Inténtalo de nuevo para otra sorpresa!'
								: ''}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Result;
