
import React from 'react';
import { PlantType, WeatherType, PLANT_DATA } from '../types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProgressStats from './ProgressStats';
import GameTips from './GameTips';

interface GameUIProps {
  day: number;
  actionsRemaining: number;
  serenityPoints: number;
  weather: WeatherType;
  inventory: Array<{ type: PlantType; count: number }>;
  selectedTool: 'plant' | 'water' | 'remove';
  selectedPlant: PlantType | null;
  onToolSelect: (tool: 'plant' | 'water' | 'remove') => void;
  onPlantSelect: (plant: PlantType) => void;
  onNextDay: () => void;
  onReset: () => void;
  harmony: number;
  totalPlants: number;
  floweringPlants: number;
  visitorCount: number;
}

const GameUI: React.FC<GameUIProps> = ({
  day,
  actionsRemaining,
  serenityPoints,
  weather,
  inventory,
  selectedTool,
  selectedPlant,
  onToolSelect,
  onPlantSelect,
  onNextDay,
  onReset,
  harmony,
  totalPlants,
  floweringPlants,
  visitorCount
}) => {
  const getWeatherIcon = () => {
    switch (weather) {
      case 'rainy': return '🌧️';
      case 'drought': return '☀️💨';
      default: return '☀️';
    }
  };

  const getWeatherDescription = () => {
    switch (weather) {
      case 'rainy': return 'Pluie (croissance accélérée)';
      case 'drought': return 'Sécheresse (arrosage urgent!)';
      default: return 'Beau temps';
    }
  };

  const getWeatherEffect = () => {
    switch (weather) {
      case 'rainy': return 'animate-pulse bg-blue-50';
      case 'drought': return 'animate-bounce bg-orange-50';
      default: return 'bg-yellow-50';
    }
  };

  const getActionColor = () => {
    if (actionsRemaining === 0) return 'text-red-600';
    if (actionsRemaining === 1) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      {/* Statistiques principales avec animations */}
      <Card className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 shadow-lg border-2 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center animate-fade-in">
            🌸 Pixel Garden Harmony 🌸
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white bg-opacity-70 rounded-lg transform transition-transform hover:scale-105">
              <div className="text-2xl font-bold text-purple-600">Jour {day}</div>
              <div className={`text-sm font-medium ${getActionColor()}`}>
                Actions: {actionsRemaining}/3
              </div>
              {actionsRemaining === 0 && (
                <div className="text-xs text-gray-500 animate-pulse">Passez au jour suivant</div>
              )}
            </div>
            <div className="p-3 bg-white bg-opacity-70 rounded-lg transform transition-transform hover:scale-105">
              <div className="text-2xl font-bold text-pink-600 animate-pulse">{serenityPoints}</div>
              <div className="text-sm text-gray-600">Points de Sérénité</div>
            </div>
          </div>
          
          <div className={`text-center p-3 bg-white bg-opacity-80 rounded-lg transition-all ${getWeatherEffect()}`}>
            <div className="text-2xl mb-1">{getWeatherIcon()}</div>
            <div className="text-xs text-gray-700 font-medium">{getWeatherDescription()}</div>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
              Harmonie: {harmony} pts
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de progression */}
      <ProgressStats
        totalPlants={totalPlants}
        floweringPlants={floweringPlants}
        harmonyLevel={harmony}
        visitorCount={visitorCount}
      />

      {/* Outils avec meilleurs effets visuels */}
      <Card className="shadow-lg border-2 border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            🛠️ Outils
            <span className="text-xs text-gray-500">
              ({selectedTool === 'plant' ? 'Plantation' : selectedTool === 'water' ? 'Arrosage' : 'Suppression'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedTool === 'plant' ? 'default' : 'outline'}
              onClick={() => onToolSelect('plant')}
              className={`text-xs transition-all transform hover:scale-105 ${
                selectedTool === 'plant' ? 'shadow-lg bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'
              }`}
            >
              🌱 Planter
            </Button>
            <Button
              variant={selectedTool === 'water' ? 'default' : 'outline'}
              onClick={() => onToolSelect('water')}
              className={`text-xs transition-all transform hover:scale-105 ${
                selectedTool === 'water' ? 'shadow-lg bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'
              }`}
            >
              💧 Arroser
            </Button>
            <Button
              variant={selectedTool === 'remove' ? 'default' : 'outline'}
              onClick={() => onToolSelect('remove')}
              className={`text-xs transition-all transform hover:scale-105 ${
                selectedTool === 'remove' ? 'shadow-lg bg-red-600 hover:bg-red-700' : 'hover:bg-red-50'
              }`}
            >
              🗑️ Retirer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventaire amélioré */}
      {selectedTool === 'plant' && (
        <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">🎒 Graines Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventory.map((item) => (
                <Button
                  key={item.type}
                  variant={selectedPlant === item.type ? 'default' : 'outline'}
                  onClick={() => onPlantSelect(item.type)}
                  disabled={item.count === 0}
                  className={`w-full justify-between text-xs transition-all transform hover:scale-102 ${
                    selectedPlant === item.type ? 'shadow-lg' : 'hover:shadow-md'
                  } ${item.count === 0 ? 'opacity-50' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{PLANT_DATA[item.type].stages.flower}</span>
                    <span>{PLANT_DATA[item.type].name}</span>
                  </span>
                  <Badge 
                    variant={item.count > 0 ? "secondary" : "outline"}
                    className={item.count === 0 ? "bg-gray-200" : ""}
                  >
                    {item.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils dynamiques */}
      <GameTips 
        weather={weather}
        actionsRemaining={actionsRemaining}
        harmony={harmony}
      />

      {/* Actions avec meilleurs effets */}
      <Card className="shadow-lg border-2 border-gray-200">
        <CardContent className="pt-4 space-y-2">
          <Button 
            onClick={onNextDay} 
            className={`w-full text-white font-medium transition-all transform hover:scale-105 ${
              actionsRemaining > 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg'
            }`}
            disabled={actionsRemaining > 0}
          >
            {actionsRemaining > 0 ? (
              <>⏳ Terminez vos actions ({actionsRemaining} restantes)</>
            ) : (
              <>🌅 Jour Suivant</>
            )}
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="w-full text-xs hover:bg-gray-50 transition-all transform hover:scale-105"
          >
            🔄 Nouveau Jardin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameUI;
