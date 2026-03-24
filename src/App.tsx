import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabNav } from './components/TabNav';
import { MainDex } from './pages/MainDex';
import { EventDex } from './pages/EventDex';
import { HabitatDex } from './pages/HabitatDex';
import { CraftingDex } from './pages/CraftingDex';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60">
          <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Pokopia Pokédex</h1>
                <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                  Pokémon Pokopia — Nintendo Switch 2
                </p>
              </div>
            </div>
            <TabNav />
          </div>
        </header>

        {/* Main */}
        <main className="max-w-screen-2xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<MainDex />} />
            <Route path="/events" element={<EventDex />} />
            <Route path="/habitats" element={<HabitatDex />} />
            <Route path="/crafting" element={<CraftingDex />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800/40 py-6 text-center text-xs text-gray-600">
          <p>Pokémon Pokopia Pokédex — Fan Database</p>
          <p className="mt-1">Data sourced from <a href="https://www.ign.com/wikis/pokemon-pokopia" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">IGN Wiki</a> · Habitat data from <a href="https://www.polygon.com/pokemon-pokopia-habitat-dex-list-requirements-unlock/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">Polygon</a> · Sprites from <a href="https://pokemondb.net" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">Pokémon Database</a></p>
          <p className="mt-1">Pokémon © Nintendo / Game Freak</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
