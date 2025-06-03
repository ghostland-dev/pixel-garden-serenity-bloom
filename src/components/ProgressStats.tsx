
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProgressStatsProps {
  totalPlants: number;
  floweringPlants: number;
  harmonyLevel: number;
  visitorCount: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalPlants,
  floweringPlants,
  harmonyLevel,
  visitorCount
}) => {
  const floweringPercentage = totalPlants > 0 ? (floweringPlants / totalPlants) * 100 : 0;
  const harmonyPercentage = Math.min((harmonyLevel / 200) * 100, 100);

  const getHarmonyLevel = () => {
    if (harmonyLevel < 50) return { label: 'Débutant', color: 'bg-gray-400' };
    if (harmonyLevel < 100) return { label: 'Apprenti', color: 'bg-green-400' };
    if (harmonyLevel < 200) return { label: 'Jardinier', color: 'bg-blue-400' };
    if (harmonyLevel < 300) return { label: 'Expert', color: 'bg-purple-400' };
    return { label: 'Maître', color: 'bg-gold-400' };
  };

  const level = getHarmonyLevel();

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          📊 Progression
          <Badge variant="outline" className={`${level.color} text-white`}>
            {level.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Plantes en fleurs</span>
            <span>{floweringPlants}/{totalPlants}</span>
          </div>
          <Progress value={floweringPercentage} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Niveau d'harmonie</span>
            <span>{harmonyLevel} pts</span>
          </div>
          <Progress value={harmonyPercentage} className="h-2 bg-purple-100" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-white rounded-lg">
            <div className="text-lg font-bold text-green-600">{totalPlants}</div>
            <div className="text-xs text-gray-600">Plantes</div>
          </div>
          <div className="p-2 bg-white rounded-lg">
            <div className="text-lg font-bold text-blue-600">{visitorCount}</div>
            <div className="text-xs text-gray-600">Visiteurs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
