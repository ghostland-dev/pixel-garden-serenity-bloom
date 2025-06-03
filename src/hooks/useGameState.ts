
import { useState, useEffect } from 'react';
import { GameState, Plant, PlantType, WeatherType, Visitor, InventoryItem, PLANT_DATA } from '../types/game';

const INITIAL_STATE: GameState = {
  grid: Array(8).fill(null).map(() => Array(8).fill(null)),
  day: 1,
  actionsRemaining: 3,
  serenityPoints: 0,
  weather: 'sunny',
  visitors: [],
  inventory: [
    { type: 'rose', count: 5 },
    { type: 'sunflower', count: 3 },
    { type: 'lavender', count: 4 },
    { type: 'daisy', count: 6 },
    { type: 'bush', count: 2 }
  ]
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('pixelGardenSave');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('pixelGardenSave', JSON.stringify(gameState));
  }, [gameState]);

  const plantSeed = (x: number, y: number, plantType: PlantType) => {
    if (gameState.actionsRemaining <= 0) return false;
    if (gameState.grid[y][x] !== null) return false;
    
    const inventoryItem = gameState.inventory.find(item => item.type === plantType);
    if (!inventoryItem || inventoryItem.count <= 0) return false;

    const newPlant: Plant = {
      id: `plant-${Date.now()}-${Math.random()}`,
      type: plantType,
      stage: 'seed',
      turnsToGrow: PLANT_DATA[plantType].growthTime,
      position: { x, y }
    };

    setGameState(prev => ({
      ...prev,
      grid: prev.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === y && colIndex === x ? newPlant : cell
        )
      ),
      actionsRemaining: prev.actionsRemaining - 1,
      inventory: prev.inventory.map(item =>
        item.type === plantType ? { ...item, count: item.count - 1 } : item
      )
    }));

    return true;
  };

  const waterPlant = (x: number, y: number) => {
    if (gameState.actionsRemaining <= 0) return false;
    const plant = gameState.grid[y][x];
    if (!plant || plant.stage === 'flower') return false;

    setGameState(prev => ({
      ...prev,
      grid: prev.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === y && colIndex === x && cell) {
            return { ...cell, turnsToGrow: Math.max(0, cell.turnsToGrow - 1) };
          }
          return cell;
        })
      ),
      actionsRemaining: prev.actionsRemaining - 1
    }));

    return true;
  };

  const removePlant = (x: number, y: number) => {
    if (gameState.actionsRemaining <= 0) return false;
    if (gameState.grid[y][x] === null) return false;

    setGameState(prev => ({
      ...prev,
      grid: prev.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === y && colIndex === x ? null : cell
        )
      ),
      actionsRemaining: prev.actionsRemaining - 1
    }));

    return true;
  };

  const calculateHarmony = () => {
    let totalHarmony = 0;
    const grid = gameState.grid;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const plant = grid[y][x];
        if (!plant || plant.stage !== 'flower') continue;

        // Bonus pour les plantes adjacentes
        const neighbors = [
          { x: x - 1, y }, { x: x + 1, y },
          { x, y: y - 1 }, { x, y: y + 1 }
        ];

        neighbors.forEach(neighbor => {
          if (neighbor.x >= 0 && neighbor.x < 8 && neighbor.y >= 0 && neighbor.y < 8) {
            const neighborPlant = grid[neighbor.y][neighbor.x];
            if (neighborPlant && neighborPlant.stage === 'flower') {
              totalHarmony += PLANT_DATA[plant.type].harmonyBonus;
            }
          }
        });
      }
    }

    return totalHarmony;
  };

  const generateVisitors = () => {
    const harmony = calculateHarmony();
    const visitorChance = Math.min(harmony / 100, 0.8); // Max 80% de chance
    const newVisitors: Visitor[] = [];

    if (Math.random() < visitorChance) {
      const visitorType = Math.random() < 0.5 ? 'butterfly' : 'bird';
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);

      newVisitors.push({
        id: `visitor-${Date.now()}-${Math.random()}`,
        type: visitorType,
        position: { x, y },
        points: visitorType === 'butterfly' ? 5 : 10
      });
    }

    return newVisitors;
  };

  const nextDay = () => {
    setGameState(prev => {
      const newGrid = prev.grid.map(row =>
        row.map(cell => {
          if (cell && cell.turnsToGrow > 0) {
            const newTurnsToGrow = cell.turnsToGrow - 1;
            let newStage = cell.stage;
            
            if (newTurnsToGrow === 0) {
              if (cell.stage === 'seed') newStage = 'sprout';
              else if (cell.stage === 'sprout') newStage = 'flower';
            }
            
            return { ...cell, turnsToGrow: newTurnsToGrow, stage: newStage };
          }
          return cell;
        })
      );

      // Génération d'événements météo
      const weatherEvents: WeatherType[] = ['sunny', 'sunny', 'sunny', 'rainy', 'drought'];
      const newWeather = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];

      // Effets de la météo
      if (newWeather === 'rainy') {
        // La pluie accélère la croissance
        newGrid.forEach(row =>
          row.forEach(cell => {
            if (cell && cell.stage !== 'flower') {
              cell.turnsToGrow = Math.max(0, cell.turnsToGrow - 1);
            }
          })
        );
      }

      const newVisitors = generateVisitors();
      const harmony = calculateHarmony();
      const visitorPoints = newVisitors.reduce((sum, visitor) => sum + visitor.points, 0);

      return {
        ...prev,
        grid: newGrid,
        day: prev.day + 1,
        actionsRemaining: 3,
        weather: newWeather,
        visitors: newVisitors,
        serenityPoints: prev.serenityPoints + harmony + visitorPoints
      };
    });
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    localStorage.removeItem('pixelGardenSave');
  };

  return {
    gameState,
    plantSeed,
    waterPlant,
    removePlant,
    calculateHarmony,
    nextDay,
    resetGame
  };
};
