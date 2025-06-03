
import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { PlantType } from '../types/game';
import GameGrid from './GameGrid';
import GameUI from './GameUI';
import { toast } from 'sonner';

const PixelGarden: React.FC = () => {
  const { gameState, plantSeed, waterPlant, removePlant, calculateHarmony, nextDay, resetGame } = useGameState();
  const [selectedTool, setSelectedTool] = useState<'plant' | 'water' | 'remove'>('plant');
  const [selectedPlant, setSelectedPlant] = useState<PlantType>('rose');

  const handleCellClick = (x: number, y: number) => {
    if (gameState.actionsRemaining <= 0) {
      toast.error("Plus d'actions disponibles aujourd'hui !");
      return;
    }

    let success = false;
    let message = '';

    switch (selectedTool) {
      case 'plant':
        success = plantSeed(x, y, selectedPlant);
        message = success ? 
          `Graine de ${selectedPlant} plantée !` : 
          'Impossible de planter ici !';
        break;
      
      case 'water':
        success = waterPlant(x, y);
        message = success ? 
          'Plante arrosée !' : 
          'Rien à arroser ici !';
        break;
      
      case 'remove':
        success = removePlant(x, y);
        message = success ? 
          'Plante retirée !' : 
          'Rien à retirer ici !';
        break;
    }

    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleNextDay = () => {
    const oldHarmony = calculateHarmony();
    nextDay();
    const newHarmony = calculateHarmony();
    
    toast.success(`Jour ${gameState.day + 1} ! Harmonie: +${newHarmony - oldHarmony} pts`);
    
    if (gameState.weather === 'rainy') {
      toast.info('🌧️ La pluie accélère la croissance !');
    } else if (gameState.weather === 'drought') {
      toast.warning('☀️💨 Sécheresse ! Vos plantes ont soif !');
    }
  };

  const handleReset = () => {
    resetGame();
    toast.success('Nouveau jardin créé !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-purple-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interface utilisateur */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <GameUI
              day={gameState.day}
              actionsRemaining={gameState.actionsRemaining}
              serenityPoints={gameState.serenityPoints}
              weather={gameState.weather}
              inventory={gameState.inventory}
              selectedTool={selectedTool}
              selectedPlant={selectedPlant}
              onToolSelect={setSelectedTool}
              onPlantSelect={setSelectedPlant}
              onNextDay={handleNextDay}
              onReset={handleReset}
              harmony={calculateHarmony()}
            />
          </div>

          {/* Grille de jeu */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex justify-center items-start">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-green-800 mb-4 drop-shadow-lg">
                🌸 Pixel Garden Harmony 🌸
              </h1>
              <GameGrid
                grid={gameState.grid}
                visitors={gameState.visitors}
                onCellClick={handleCellClick}
                selectedTool={selectedTool}
              />
              
              {/* Indicateurs de visiteurs */}
              {gameState.visitors.length > 0 && (
                <div className="mt-4 p-3 bg-white bg-opacity-80 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ✨ Visiteurs attirés par la beauté de votre jardin ! ✨
                  </p>
                  <div className="flex justify-center space-x-2 mt-1">
                    {gameState.visitors.map(visitor => (
                      <span key={visitor.id} className="text-lg">
                        {visitor.type === 'butterfly' ? '🦋' : '🐦'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelGarden;
