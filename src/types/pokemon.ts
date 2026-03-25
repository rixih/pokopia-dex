export type IdealHabitat = 'Bright' | 'Warm' | 'Humid' | 'Dry' | 'Dark' | 'Cool' | '';
export type Rarity = 'Common' | 'Rare' | 'Very Rare' | 'Legendary' | '';

export type PokemonType =
  | 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice'
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug'
  | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy';

export type TimeOfDay = 'Morning' | 'Day' | 'Evening' | 'Night';
export type Weather = 'Sunny' | 'Cloudy' | 'Rainy';

export interface Pokemon {
  number: string;
  displayNumber?: string;
  name: string;
  types: PokemonType[];
  rarity: Rarity;
  ignSprite?: string;
  isUniquePal?: boolean;
  idealHabitat: IdealHabitat;
  habitats: string[];
  habitatItems: string[];
  times: TimeOfDay[];
  weather: Weather[];
  specialties: string[];
  favorites: string[];
  flavor?: string;
  height: string;
  weight: string;
  description: string;
}

export interface EventPokemon extends Pokemon {
  areasFound: string;
  eventStart?: string;
  eventEnd?: string;
}

export interface FilterState {
  search: string;
  types: PokemonType[];
  rarity: Rarity | '';
  uniqueOnly: boolean;
  idealHabitat: IdealHabitat | '';
  times: TimeOfDay[];
  weather: Weather[];
  specialties: string[];
}

export interface CraftingRequirement {
  item: string;
  quantity: number;
}

export interface CraftingItem {
  name: string;
  category: string;
  location: string;
  requirements: CraftingRequirement[];
  imageUrl: string | null;
}

