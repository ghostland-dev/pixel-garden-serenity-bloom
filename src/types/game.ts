
export interface Plant {
  id: string;
  type: PlantType;
  stage: PlantStage;
  turnsToGrow: number;
  position: { x: number; y: number };
  health: number;
  watered: boolean;
  diseased: boolean;
}

export interface GameState {
  grid: (Plant | null)[][];
  day: number;
  actionsRemaining: number;
  serenityPoints: number;
  weather: WeatherType;
  season: SeasonType;
  visitors: Visitor[];
  inventory: InventoryItem[];
  achievements: Achievement[];
  shopItems: ShopItem[];
  soundEnabled: boolean;
  saveSlot: number;
}

export type PlantType = 'rose' | 'sunflower' | 'lavender' | 'daisy' | 'bush' | 'tulip' | 'orchid' | 'lily';

export type PlantStage = 'seed' | 'sprout' | 'flower';

export type WeatherType = 'sunny' | 'rainy' | 'drought' | 'cloudy' | 'storm';

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Visitor {
  id: string;
  type: 'butterfly' | 'bird' | 'bee' | 'ladybug';
  position: { x: number; y: number };
  points: number;
}

export interface InventoryItem {
  type: PlantType;
  count: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: number;
}

export interface ShopItem {
  type: PlantType;
  price: number;
  unlocked: boolean;
  description: string;
}

export const PLANT_DATA: Record<PlantType, {
  name: string;
  stages: Record<PlantStage, string>;
  growthTime: number;
  harmonyBonus: number;
  seasonPreference: SeasonType[];
  price: number;
}> = {
  rose: {
    name: 'Rose',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌹' },
    growthTime: 2,
    harmonyBonus: 15,
    seasonPreference: ['spring', 'summer'],
    price: 5
  },
  sunflower: {
    name: 'Tournesol',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌻' },
    growthTime: 3,
    harmonyBonus: 20,
    seasonPreference: ['summer'],
    price: 8
  },
  lavender: {
    name: 'Lavande',
    stages: { seed: '🌱', sprout: '🪴', flower: '🪻' },
    growthTime: 2,
    harmonyBonus: 12,
    seasonPreference: ['spring', 'summer', 'autumn'],
    price: 6
  },
  daisy: {
    name: 'Marguerite',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌼' },
    growthTime: 1,
    harmonyBonus: 10,
    seasonPreference: ['spring', 'summer'],
    price: 3
  },
  bush: {
    name: 'Buisson',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌳' },
    growthTime: 4,
    harmonyBonus: 25,
    seasonPreference: ['spring', 'summer', 'autumn'],
    price: 15
  },
  tulip: {
    name: 'Tulipe',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌷' },
    growthTime: 2,
    harmonyBonus: 18,
    seasonPreference: ['spring'],
    price: 10
  },
  orchid: {
    name: 'Orchidée',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌺' },
    growthTime: 5,
    harmonyBonus: 35,
    seasonPreference: ['spring', 'summer'],
    price: 25
  },
  lily: {
    name: 'Lys',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌸' },
    growthTime: 3,
    harmonyBonus: 22,
    seasonPreference: ['spring', 'summer'],
    price: 12
  }
};

export const ACHIEVEMENTS = [
  {
    id: 'first_plant',
    name: 'Premier Jardinier',
    description: 'Plantez votre première graine',
    target: 1,
    reward: 10
  },
  {
    id: 'flower_master',
    name: 'Maître des Fleurs',
    description: 'Ayez 10 fleurs épanouies en même temps',
    target: 10,
    reward: 50
  },
  {
    id: 'harmony_expert',
    name: 'Expert en Harmonie',
    description: 'Atteignez 200 points d\'harmonie',
    target: 200,
    reward: 75
  },
  {
    id: 'visitor_magnet',
    name: 'Aimant à Visiteurs',
    description: 'Attirez 20 visiteurs dans votre jardin',
    target: 20,
    reward: 100
  }
];
