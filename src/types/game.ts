
export interface Plant {
  id: string;
  type: PlantType;
  stage: PlantStage;
  turnsToGrow: number;
  position: { x: number; y: number };
}

export interface GameState {
  grid: (Plant | null)[][];
  day: number;
  actionsRemaining: number;
  serenityPoints: number;
  weather: WeatherType;
  visitors: Visitor[];
  inventory: InventoryItem[];
}

export type PlantType = 'rose' | 'sunflower' | 'lavender' | 'daisy' | 'bush';

export type PlantStage = 'seed' | 'sprout' | 'flower';

export type WeatherType = 'sunny' | 'rainy' | 'drought';

export interface Visitor {
  id: string;
  type: 'butterfly' | 'bird';
  position: { x: number; y: number };
  points: number;
}

export interface InventoryItem {
  type: PlantType;
  count: number;
}

export const PLANT_DATA: Record<PlantType, {
  name: string;
  stages: Record<PlantStage, string>;
  growthTime: number;
  harmonyBonus: number;
}> = {
  rose: {
    name: 'Rose',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌹' },
    growthTime: 2,
    harmonyBonus: 15
  },
  sunflower: {
    name: 'Tournesol',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌻' },
    growthTime: 3,
    harmonyBonus: 20
  },
  lavender: {
    name: 'Lavande',
    stages: { seed: '🌱', sprout: '🪴', flower: '🪻' },
    growthTime: 2,
    harmonyBonus: 12
  },
  daisy: {
    name: 'Marguerite',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌼' },
    growthTime: 1,
    harmonyBonus: 10
  },
  bush: {
    name: 'Buisson',
    stages: { seed: '🌱', sprout: '🪴', flower: '🌳' },
    growthTime: 4,
    harmonyBonus: 25
  }
};
