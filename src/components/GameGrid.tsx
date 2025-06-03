
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
      return visitor.type === 'butterfly' ? '🦋' : '🐦';
    }
    
    if (plant) {
      return PLANT_DATA[plant.type].stages[plant.stage];
    }
    
    return '';
  };

  const getCellStyle = (x: number, y: number, plant: Plant | null) => {
    let baseClasses = "w-12 h-12 border-2 border-green-200 bg-green-50 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 hover:bg-green-100";
    
    if (selectedTool === 'plant' && !plant) {
      baseClasses += " hover:bg-green-200 hover:border-green-400";
    } else if (selectedTool === 'water' && plant && plant.stage !== 'flower') {
      baseClasses += " hover:bg-blue-100 hover:border-blue-400";
    } else if (selectedTool === 'remove' && plant) {
      baseClasses += " hover:bg-red-100 hover:border-red-400";
    }

    return baseClasses;
  };

  return (
    <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg">
      <div className="grid grid-cols-8 gap-1 bg-green-300 p-2 rounded-lg">
        {grid.map((row, y) =>
          row.map((plant, x) => (
            <div
              key={`${x}-${y}`}
              className={cn(getCellStyle(x, y, plant))}
              onClick={() => onCellClick(x, y)}
              title={plant ? `${PLANT_DATA[plant.type].name} (${plant.stage})` : 'Terre vide'}
            >
              {getCellDisplay(plant, x, y)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameGrid;
