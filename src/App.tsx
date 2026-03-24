import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabNav } from './components/TabNav';
import { MainDex } from './pages/MainDex';
import { EventDex } from './pages/EventDex';
import { HabitatDex } from './pages/HabitatDex';
import { CraftingDex } from './pages/CraftingDex';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 relative">
        {/* Background */}
        <img
          src="/bg.png"
          alt=""
          className="fixed inset-0 w-full h-full object-cover z-0 opacity-100"
          aria-hidden="true"
        />
        {/* Dark overlay to tone down background */}
        <div className="fixed inset-0 z-[1] bg-black/60" aria-hidden="true" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60 relative">
          <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 100 100" className="w-9 h-9" aria-hidden="true">
                <circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="#c0392b" strokeWidth="3"/>
                <path d="M2 50 a48 48 0 0 1 96 0" fill="#c0392b"/>
                <path d="M2 50 a48 48 0 0 0 96 0" fill="#f0f0f0"/>
                <line x1="2" y1="50" x2="98" y2="50" stroke="#1a1a1a" strokeWidth="6"/>
                <circle cx="50" cy="50" r="14" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="4"/>
                <circle cx="50" cy="50" r="9" fill="#f0f0f0"/>
              </svg>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Pokopia Pokédex</h1>
                <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                  Pokémon Pokopia — Nintendo Switch 2
                </p>
                <p className="text-xs text-gray-600 leading-tight hidden sm:block">
                  Fan-made by <span className="text-yellow-400 font-semibold">Rixih</span>
                </p>
              </div>
            </div>
            <TabNav />
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 max-w-screen-2xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<MainDex />} />
            <Route path="/events" element={<EventDex />} />
            <Route path="/habitats" element={<HabitatDex />} />
            <Route path="/crafting" element={<CraftingDex />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-16 border-t border-gray-800/40 py-6 text-center text-xs text-gray-600">
          <p>Pokémon Pokopia Pokédex — Fan Database</p>
          <p className="mt-1">Data sourced from <a href="https://www.ign.com/wikis/pokemon-pokopia" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">IGN Wiki</a> · Habitat data from <a href="https://www.polygon.com/pokemon-pokopia-habitat-dex-list-requirements-unlock/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">Polygon</a> · Sprites from <a href="https://pokemondb.net" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">Pokémon Database</a></p>
          <p className="mt-1">Pokémon © Nintendo / Game Freak</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
