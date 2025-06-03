
import { useState, useEffect } from 'react';
import { GameState, Plant, PlantType, WeatherType, SeasonType, Visitor, InventoryItem, Achievement, ShopItem, PLANT_DATA, ACHIEVEMENTS } from '../types/game';
import { toast } from 'sonner';

const INITIAL_STATE: GameState = {
  grid: Array(8).fill(null).map(() => Array(8).fill(null)),
  day: 1,
  actionsRemaining: 3,
  serenityPoints: 50,
  weather: 'sunny',
  season: 'spring',
  visitors: [],
  inventory: [
    { type: 'rose', count: 5 },
    { type: 'sunflower', count: 3 },
    { type: 'lavender', count: 4 },
    { type: 'daisy', count: 6 }
  ],
  achievements: ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, progress: 0 })),
  shopItems: [
    { type: 'bush', price: 15, unlocked: true, description: 'Croissance lente mais haute harmonie' },
    { type: 'tulip', price: 10, unlocked: true, description: 'Parfait pour le printemps' },
    { type: 'orchid', price: 25, unlocked: false, description: 'Rare et précieuse' },
    { type: 'lily', price: 12, unlocked: false, description: 'Élégante et gracieuse' }
  ],
  soundEnabled: true,
  saveSlot: 1
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

  const playSound = (type: string) => {
    if (!gameState.soundEnabled) return;
    // Simulate sound with console log for now
    console.log(`🔊 Playing sound: ${type}`);
  };

  const checkAchievements = (newState: GameState) => {
    let updatedAchievements = [...newState.achievements];
    let pointsEarned = 0;

    // Check each achievement
    updatedAchievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let progress = 0;
      switch (achievement.id) {
        case 'first_plant':
          progress = newState.grid.flat().filter(cell => cell !== null).length > 0 ? 1 : 0;
          break;
        case 'flower_master':
          progress = newState.grid.flat().filter(cell => cell && cell.stage === 'flower').length;
          break;
        case 'harmony_expert':
          progress = calculateHarmony(newState);
          break;
        case 'visitor_magnet':
          // This would need to track total visitors over time
          break;
      }

      achievement.progress = Math.min(progress, achievement.target);
      
      if (achievement.progress >= achievement.target && !achievement.unlocked) {
        achievement.unlocked = true;
        pointsEarned += achievement.reward;
        toast.success(`🏆 Succès débloqué: ${achievement.name}!`, {
          description: `+${achievement.reward} points de sérénité`
        });
        playSound('achievement');
      }
    });

    return { achievements: updatedAchievements, pointsEarned };
  };

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
      position: { x, y },
      health: 100,
      watered: false,
      diseased: false
    };

    setGameState(prev => {
      const newState = {
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
      };

      const { achievements, pointsEarned } = checkAchievements(newState);
      playSound('plant');
      
      return {
        ...newState,
        achievements,
        serenityPoints: newState.serenityPoints + pointsEarned
      };
    });

    return true;
  };

  const waterPlant = (x: number, y: number) => {
    if (gameState.actionsRemaining <= 0) return false;
    const plant = gameState.grid[y][x];
    if (!plant || plant.stage === 'flower') return false;

    setGameState(prev => {
      const newState = {
        ...prev,
        grid: prev.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (rowIndex === y && colIndex === x && cell) {
              return { 
                ...cell, 
                turnsToGrow: Math.max(0, cell.turnsToGrow - 1),
                watered: true,
                health: Math.min(100, cell.health + 20)
              };
            }
            return cell;
          })
        ),
        actionsRemaining: prev.actionsRemaining - 1
      };

      playSound('water');
      return newState;
    });

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

    playSound('remove');
    return true;
  };

  const calculateHarmony = (state: GameState = gameState) => {
    let totalHarmony = 0;
    const grid = state.grid;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const plant = grid[y][x];
        if (!plant || plant.stage !== 'flower') continue;

        let bonus = PLANT_DATA[plant.type].harmonyBonus;
        
        // Season bonus
        if (PLANT_DATA[plant.type].seasonPreference.includes(state.season)) {
          bonus *= 1.5;
        }

        // Health penalty
        bonus *= (plant.health / 100);

        // Neighbor bonus
        const neighbors = [
          { x: x - 1, y }, { x: x + 1, y },
          { x, y: y - 1 }, { x, y: y + 1 }
        ];

        neighbors.forEach(neighbor => {
          if (neighbor.x >= 0 && neighbor.x < 8 && neighbor.y >= 0 && neighbor.y < 8) {
            const neighborPlant = grid[neighbor.y][neighbor.x];
            if (neighborPlant && neighborPlant.stage === 'flower') {
              bonus += 5;
            }
          }
        });

        totalHarmony += Math.floor(bonus);
      }
    }

    return totalHarmony;
  };

  const generateWeatherEvent = (): WeatherType => {
    const events: WeatherType[] = ['sunny', 'sunny', 'cloudy', 'rainy', 'drought', 'storm'];
    return events[Math.floor(Math.random() * events.length)];
  };

  const getSeason = (day: number): SeasonType => {
    const seasonCycle = Math.floor((day - 1) / 30) % 4;
    return ['spring', 'summer', 'autumn', 'winter'][seasonCycle] as SeasonType;
  };

  const applyWeatherEffects = (grid: (Plant | null)[][], weather: WeatherType) => {
    return grid.map(row =>
      row.map(cell => {
        if (!cell) return cell;
        
        let newCell = { ...cell };
        
        switch (weather) {
          case 'rainy':
            newCell.watered = true;
            newCell.health = Math.min(100, newCell.health + 10);
            if (newCell.stage !== 'flower') {
              newCell.turnsToGrow = Math.max(0, newCell.turnsToGrow - 1);
            }
            break;
          case 'drought':
            if (!newCell.watered) {
              newCell.health = Math.max(0, newCell.health - 30);
            }
            break;
          case 'storm':
            newCell.health = Math.max(0, newCell.health - 15);
            if (Math.random() < 0.1) {
              newCell.diseased = true;
            }
            break;
        }
        
        return newCell;
      })
    );
  };

  const generateVisitors = (harmony: number) => {
    const visitorChance = Math.min(harmony / 100, 0.8);
    const newVisitors: Visitor[] = [];

    if (Math.random() < visitorChance) {
      const visitorTypes: Visitor['type'][] = ['butterfly', 'bird', 'bee', 'ladybug'];
      const visitorType = visitorTypes[Math.floor(Math.random() * visitorTypes.length)];
      const points = { butterfly: 5, bird: 10, bee: 8, ladybug: 6 }[visitorType];
      
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);

      newVisitors.push({
        id: `visitor-${Date.now()}-${Math.random()}`,
        type: visitorType,
        position: { x, y },
        points
      });
    }

    return newVisitors;
  };

  const purchaseItem = (plantType: PlantType, price: number) => {
    if (gameState.serenityPoints < price) return false;

    setGameState(prev => ({
      ...prev,
      serenityPoints: prev.serenityPoints - price,
      inventory: prev.inventory.map(item =>
        item.type === plantType 
          ? { ...item, count: item.count + 1 }
          : item
      ).concat(
        prev.inventory.find(item => item.type === plantType) 
          ? [] 
          : [{ type: plantType, count: 1 }]
      )
    }));

    playSound('purchase');
    return true;
  };

  const nextDay = () => {
    setGameState(prev => {
      const newWeather = generateWeatherEvent();
      const newSeason = getSeason(prev.day + 1);
      
      let newGrid = prev.grid.map(row =>
        row.map(cell => {
          if (cell && cell.turnsToGrow > 0) {
            const newTurnsToGrow = cell.turnsToGrow - 1;
            let newStage = cell.stage;
            
            if (newTurnsToGrow === 0) {
              if (cell.stage === 'seed') newStage = 'sprout';
              else if (cell.stage === 'sprout') newStage = 'flower';
            }
            
            return { ...cell, turnsToGrow: newTurnsToGrow, stage: newStage, watered: false };
          }
          return cell;
        })
      );

      // Apply weather effects
      newGrid = applyWeatherEffects(newGrid, newWeather);

      const newState = {
        ...prev,
        grid: newGrid,
        day: prev.day + 1,
        actionsRemaining: 3,
        weather: newWeather,
        season: newSeason,
        visitors: generateVisitors(calculateHarmony({ ...prev, grid: newGrid }))
      };

      const harmony = calculateHarmony(newState);
      const visitorPoints = newState.visitors.reduce((sum, visitor) => sum + visitor.points, 0);
      const { achievements, pointsEarned } = checkAchievements(newState);

      // Unlock shop items based on achievements
      const updatedShopItems = newState.shopItems?.map(item => ({
        ...item,
        unlocked: item.unlocked || (
          (item.type === 'orchid' && achievements.find(a => a.id === 'harmony_expert')?.unlocked) ||
          (item.type === 'lily' && achievements.find(a => a.id === 'flower_master')?.unlocked)
        )
      })) || prev.shopItems;

      return {
        ...newState,
        achievements,
        shopItems: updatedShopItems,
        serenityPoints: newState.serenityPoints + harmony + visitorPoints + pointsEarned
      };
    });
  };

  const toggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const saveGame = () => {
    const saveData = JSON.stringify(gameState);
    localStorage.setItem(`pixelGardenSave_slot_${gameState.saveSlot}`, saveData);
    toast.success('Jardin sauvegardé !', {
      description: `Slot ${gameState.saveSlot} mis à jour`
    });
  };

  const loadGame = (slot: number) => {
    const saveData = localStorage.getItem(`pixelGardenSave_slot_${slot}`);
    if (saveData) {
      const loadedState = JSON.parse(saveData);
      setGameState({ ...loadedState, saveSlot: slot });
      toast.success('Jardin chargé !', {
        description: `Slot ${slot} restauré`
      });
    } else {
      toast.error('Aucune sauvegarde trouvée !', {
        description: `Le slot ${slot} est vide`
      });
    }
  };

  const exportSave = () => {
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-garden-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sauvegarde exportée !');
  };

  const importSave = (saveData: string) => {
    try {
      const loadedState = JSON.parse(saveData);
      setGameState(loadedState);
      toast.success('Sauvegarde importée !');
    } catch (error) {
      toast.error('Fichier de sauvegarde invalide !');
    }
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
    resetGame,
    purchaseItem,
    toggleSound,
    saveGame,
    loadGame,
    exportSave,
    importSave
  };
};
