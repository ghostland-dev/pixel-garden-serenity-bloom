
import React from 'react';
import { Plant, PLANT_DATA } from '../types/game';
import { cn } from '../lib/utils';

interface GameGridProps {
  grid: (Plant | null)[][];
  visitors: Array<{ id: string; type: 'butterfly' | 'bird'; position: { x: number; y: number } }>;
  onCellClick: (x: number, y: number) => void;
  selectedTool: string;
}

const GameGrid: React.FC<GameGridProps> = ({ grid, visitors, onCellClick, selectedTool }) => {
  const getVisitorAtPosition = (x: number, y: number) => {
    return visitors.find(visitor => visitor.position.x === x && visitor.position.y === y);
  };

  const getCellDisplay = (plant: Plant | null, x: number, y: number) => {
    const visitor = getVisitorAtPosition(x, y);
    
    if (visitor) {
      return (
        <span className="animate-bounce">
          {visitor.type === 'butterfly' ? '🦋' : '🐦'}
        </span>
      );
    }
    
    if (plant) {
      const emoji = PLANT_DATA[plant.type].stages[plant.stage];
      return (
        <span className={plant.stage === 'flower' ? 'animate-pulse' : ''}>
          {emoji}
        </span>
      );
    }
    
    return '';
  };

  const getCellStyle = (x: number, y: number, plant: Plant | null) => {
    let baseClasses = "w-12 h-12 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden";
    
    // Effets de survol selon l'outil sélectionné
    if (selectedTool === 'plant' && !plant) {
      baseClasses += " hover:bg-gradient-to-br hover:from-green-200 hover:to-emerald-200 hover:border-green-400 hover:shadow-lg";
    } else if (selectedTool === 'water' && plant && plant.stage !== 'flower') {
      baseClasses += " hover:bg-gradient-to-br hover:from-blue-100 hover:to-cyan-100 hover:border-blue-400 hover:shadow-lg";
    } else if (selectedTool === 'remove' && plant) {
      baseClasses += " hover:bg-gradient-to-br hover:from-red-100 hover:to-pink-100 hover:border-red-400 hover:shadow-lg";
    }

    // Style spécial pour les plantes en fleurs
    if (plant && plant.stage === 'flower') {
      baseClasses += " bg-gradient-to-br from-green-100 to-emerald-100 shadow-inner";
    }

    // Style spécial pour les cellules avec visiteurs
    const visitor = getVisitorAtPosition(x, y);
    if (visitor) {
      baseClasses += " bg-gradient-to-br from-yellow-100 to-amber-100 shadow-lg ring-2 ring-yellow-300";
    }

    return baseClasses;
  };

  const getToolIndicator = (x: number, y: number, plant: Plant | null) => {
    if (selectedTool === 'plant' && !plant) {
      return (
        <div className="absolute inset-0 bg-green-200 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-sm">🌱</span>
        </div>
      );
    }
    if (selectedTool === 'water' && plant && plant.stage !== 'flower') {
      return (
        <div className="absolute inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-sm">💧</span>
        </div>
      );
    }
    if (selectedTool === 'remove' && plant) {
      return (
        <div className="absolute inset-0 bg-red-200 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-sm">🗑️</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="inline-block p-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-2xl border-4 border-green-200">
      <div className="grid grid-cols-8 gap-1 bg-gradient-to-br from-green-200 to-emerald-200 p-3 rounded-xl shadow-inner">
        {grid.map((row, y) =>
          row.map((plant, x) => (
            <div
              key={`${x}-${y}`}
              className={cn(getCellStyle(x, y, plant))}
              onClick={() => onCellClick(x, y)}
              title={plant ? `${PLANT_DATA[plant.type].name} (${plant.stage})` : 'Terre fertile'}
            >
              {getCellDisplay(plant, x, y)}
              {getToolIndicator(x, y, plant)}
              
              {/* Effet de brillance pour les fleurs */}
              {plant && plant.stage === 'flower' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameGrid;
