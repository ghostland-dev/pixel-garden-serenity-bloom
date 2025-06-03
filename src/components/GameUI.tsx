
import React from 'react';
import { PlantType, WeatherType, PLANT_DATA } from '../types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameUIProps {
  day: number;
  actionsRemaining: number;
  serenityPoints: number;
  weather: WeatherType;
  inventory: Array<{ type: PlantType; count: number }>;
  selectedTool: string;
  selectedPlant: PlantType | null;
  onToolSelect: (tool: string) => void;
  onPlantSelect: (plant: PlantType) => void;
  onNextDay: () => void;
  onReset: () => void;
  harmony: number;
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
  harmony
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

  return (
    <div className="space-y-4">
      {/* Statistiques principales */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">🌸 Pixel Garden Harmony 🌸</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">Jour {day}</div>
              <div className="text-sm text-gray-600">Actions: {actionsRemaining}/3</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">{serenityPoints}</div>
              <div className="text-sm text-gray-600">Points de Sérénité</div>
            </div>
          </div>
          
          <div className="text-center p-2 bg-white rounded-lg">
            <div className="text-lg">{getWeatherIcon()}</div>
            <div className="text-xs text-gray-600">{getWeatherDescription()}</div>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-green-700">
              Harmonie: {harmony} pts
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Outils */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">🛠️ Outils</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedTool === 'plant' ? 'default' : 'outline'}
              onClick={() => onToolSelect('plant')}
              className="text-xs"
            >
              🌱 Planter
            </Button>
            <Button
              variant={selectedTool === 'water' ? 'default' : 'outline'}
              onClick={() => onToolSelect('water')}
              className="text-xs"
            >
              💧 Arroser
            </Button>
            <Button
              variant={selectedTool === 'remove' ? 'default' : 'outline'}
              onClick={() => onToolSelect('remove')}
              className="text-xs"
            >
              🗑️ Retirer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventaire */}
      {selectedTool === 'plant' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">🎒 Graines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventory.map((item) => (
                <Button
                  key={item.type}
                  variant={selectedPlant === item.type ? 'default' : 'outline'}
                  onClick={() => onPlantSelect(item.type)}
                  disabled={item.count === 0}
                  className="w-full justify-between text-xs"
                >
                  <span>
                    {PLANT_DATA[item.type].stages.flower} {PLANT_DATA[item.type].name}
                  </span>
                  <Badge variant="secondary">{item.count}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <Button 
            onClick={onNextDay} 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={actionsRemaining > 0}
          >
            🌅 Jour Suivant
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="w-full text-xs"
          >
            🔄 Nouveau Jardin
          </Button>
        </CardContent>
      </Card>

      {/* Guide rapide */}
      <Card className="bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">💡 Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <p>🌱 Plantez des graines adjacentes pour l'harmonie</p>
          <p>💧 Arrosez pour accélérer la croissance</p>
          <p>🦋 Plus d'harmonie = plus de visiteurs</p>
          <p>🌧️ La pluie aide, la sécheresse nuit</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameUI;
