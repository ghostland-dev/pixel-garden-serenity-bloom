
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameTipsProps {
  weather: string;
  actionsRemaining: number;
  harmony: number;
}

const GameTips: React.FC<GameTipsProps> = ({ weather, actionsRemaining, harmony }) => {
  const [currentTip, setCurrentTip] = useState(0);

  const getTips = () => {
    const tips = [
      "🌱 Plantez des graines côte à côte pour créer de l'harmonie",
      "💧 Arrosez vos plantes pour accélérer leur croissance",
      "🦋 Plus d'harmonie attire plus de visiteurs magiques",
      "🌸 Les fleurs adjacentes génèrent des bonus d'harmonie"
    ];

    // Conseils contextuels
    if (weather === 'drought') {
      tips.unshift("⚠️ Sécheresse ! Arrosez vos plantes rapidement !");
    }
    if (weather === 'rainy') {
      tips.unshift("🌧️ Profitez de la pluie pour planter de nouvelles graines !");
    }
    if (harmony < 50) {
      tips.unshift("🎯 Conseil : Plantez des fleurs adjacentes pour plus d'harmonie");
    }
    if (actionsRemaining === 1) {
      tips.unshift("⏰ Plus qu'une action aujourd'hui, choisissez bien !");
    }

    return tips;
  };

  const tips = getTips();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          💡 Conseil du moment
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTip}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTip}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-amber-800 animate-fade-in">
          {tips[currentTip]}
        </p>
        <div className="flex justify-center mt-2 gap-1">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-1 rounded-full transition-all ${
                index === currentTip ? 'bg-amber-600' : 'bg-amber-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameTips;
