import type { Pokemon } from '../types/pokemon';

export function formatNameForDb(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/['']/g, '')
    .replace(/\./g, '')
    .replace(/é/g, 'e')
    .replace(/\?/g, '')
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m');
}

export function getSpriteUrl(pokemon: Pokemon): string {
  if (pokemon.ignSprite) return pokemon.ignSprite;
  return `https://img.pokemondb.net/sprites/home/normal/${formatNameForDb(pokemon.name)}.png`;
}
