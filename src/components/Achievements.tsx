
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '../types/game';

interface AchievementsProps {
  achievements: Achievement[];
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, onClose }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[80vh] overflow-auto bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🏆 Succès</CardTitle>
          <div className="text-sm text-gray-600">
            {unlockedCount}/{totalCount} succès débloqués
          </div>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                achievement.unlocked 
                  ? 'border-gold-200 bg-gradient-to-r from-yellow-50 to-amber-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {achievement.unlocked ? '🏆' : '🔒'}
                    </span>
                    <div className="font-medium">{achievement.name}</div>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {achievement.description}
                  </div>
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        Progression: {achievement.progress}/{achievement.target}
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
                <Badge 
                  variant={achievement.unlocked ? "default" : "secondary"}
                  className="ml-2"
                >
                  +{achievement.reward} pts
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              ❌ Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
