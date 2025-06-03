
import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { PlantType } from '../types/game';
import GameGrid from './GameGrid';
import GameUI from './GameUI';
import ParticleEffect from './ParticleEffect';
import { toast } from 'sonner';

const PixelGarden: React.FC = () => {
  const { gameState, plantSeed, waterPlant, removePlant, calculateHarmony, nextDay, resetGame } = useGameState();
  const [selectedTool, setSelectedTool] = useState<'plant' | 'water' | 'remove'>('plant');
  const [selectedPlant, setSelectedPlant] = useState<PlantType>('rose');
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType] = useState<'water' | 'plant' | 'harvest' | 'visitor'>('plant');

  const triggerParticles = (type: 'water' | 'plant' | 'harvest' | 'visitor') => {
    setParticleType(type);
    setParticleTrigger(prev => prev + 1);
  };

  const countPlants = () => {
    let total = 0;
    let flowering = 0;
    
    gameState.grid.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          total++;
          if (cell.stage === 'flower') flowering++;
        }
      });
    });
    
    return { total, flowering };
  };

  const { total: totalPlants, flowering: floweringPlants } = countPlants();

  const handleCellClick = (x: number, y: number) => {
    if (gameState.actionsRemaining <= 0) {
      toast.error("Plus d'actions disponibles aujourd'hui !", {
        description: "Passez au jour suivant pour continuer"
      });
      return;
    }

    let success = false;
    let message = '';

    switch (selectedTool) {
      case 'plant':
        success = plantSeed(x, y, selectedPlant);
        if (success) {
          message = `🌱 Graine de ${selectedPlant} plantée avec amour !`;
          triggerParticles('plant');
        } else {
          message = 'Impossible de planter ici ! Choisissez une case vide.';
        }
        break;
      
      case 'water':
        success = waterPlant(x, y);
        if (success) {
          message = '💧 Plante arrosée ! Elle va pousser plus vite.';
          triggerParticles('water');
        } else {
          message = 'Rien à arroser ici ! Trouvez une plante qui pousse.';
        }
        break;
      
      case 'remove':
        success = removePlant(x, y);
        if (success) {
          message = '🗑️ Plante retirée ! Place à de nouveaux projets.';
        } else {
          message = 'Rien à retirer ici ! Sélectionnez une plante.';
        }
        break;
    }

    if (success) {
      toast.success(message, {
        description: `Actions restantes : ${gameState.actionsRemaining - 1}`
      });
    } else {
      toast.error(message);
    }
  };

  const handleNextDay = () => {
    const oldHarmony = calculateHarmony();
    const oldVisitors = gameState.visitors.length;
    nextDay();
    const newHarmony = calculateHarmony();
    const newVisitors = gameState.visitors.length;
    
    if (newVisitors > oldVisitors) {
      triggerParticles('visitor');
    }
    
    toast.success(`🌅 Bienvenue au jour ${gameState.day + 1} !`, {
      description: `Harmonie: +${newHarmony - oldHarmony} pts • Nouveaux visiteurs: ${newVisitors - oldVisitors}`
    });
    
    if (gameState.weather === 'rainy') {
      toast.info('🌧️ La pluie bénit votre jardin !', {
        description: 'Vos plantes vont pousser plus vite aujourd\'hui'
      });
    } else if (gameState.weather === 'drought') {
      toast.warning('☀️💨 Attention à la sécheresse !', {
        description: 'Vos plantes ont besoin d\'eau urgente'
      });
    }
  };

  const handleReset = () => {
    resetGame();
    toast.success('🆕 Nouveau jardin créé !', {
      description: 'Prêt pour une nouvelle aventure de jardinage'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-purple-200 p-4">
      <ParticleEffect trigger={particleTrigger} type={particleType} />
      
      <div className="max-w-7xl mx-auto">
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
              totalPlants={totalPlants}
              floweringPlants={floweringPlants}
              visitorCount={gameState.visitors.length}
            />
          </div>

          {/* Grille de jeu */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex justify-center items-start">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-green-800 mb-6 drop-shadow-lg animate-fade-in">
                🌸 Pixel Garden Harmony 🌸
              </h1>
              <GameGrid
                grid={gameState.grid}
                visitors={gameState.visitors}
                onCellClick={handleCellClick}
                selectedTool={selectedTool}
              />
              
              {/* Indicateurs de visiteurs améliorés */}
              {gameState.visitors.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 bg-opacity-90 rounded-xl shadow-lg border-2 border-yellow-200 animate-fade-in">
                  <p className="text-sm text-amber-800 font-medium mb-2">
                    ✨ Visiteurs enchantés par votre jardin ! ✨
                  </p>
                  <div className="flex justify-center space-x-3">
                    {gameState.visitors.map(visitor => (
                      <span 
                        key={visitor.id} 
                        className="text-2xl animate-bounce" 
                        style={{ animationDelay: `${Math.random() * 2}s` }}
                      >
                        {visitor.type === 'butterfly' ? '🦋' : '🐦'}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-amber-700 mt-2">
                    Chaque visiteur vous rapporte des points de sérénité !
                  </p>
                </div>
              )}

              {/* Encouragements selon le niveau */}
              {calculateHarmony() > 100 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-md animate-pulse">
                  <p className="text-sm text-purple-700 font-medium">
                    🎉 Excellent travail ! Votre jardin rayonne d'harmonie !
                  </p>
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
