
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShopItem, PLANT_DATA } from '../types/game';
import { toast } from 'sonner';

interface ShopProps {
  serenityPoints: number;
  shopItems: ShopItem[];
  onPurchase: (plantType: string, price: number) => void;
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ serenityPoints, shopItems, onPurchase, onClose }) => {
  const handlePurchase = (item: ShopItem) => {
    if (serenityPoints >= item.price) {
      onPurchase(item.type, item.price);
      toast.success(`🎉 ${PLANT_DATA[item.type].name} acheté !`, {
        description: `Coût: ${item.price} points de sérénité`
      });
    } else {
      toast.error('Pas assez de points de sérénité !', {
        description: `Il vous faut ${item.price - serenityPoints} points de plus`
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[80vh] overflow-auto bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🏪 Boutique Magique</CardTitle>
          <div className="flex justify-center items-center gap-2">
            <span className="text-lg">💰</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {serenityPoints} Points
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {shopItems.map((item) => (
            <div
              key={item.type}
              className={`p-4 border-2 rounded-lg transition-all ${
                item.unlocked ? 'border-green-200 bg-white' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{PLANT_DATA[item.type].stages.flower}</span>
                  <div>
                    <div className="font-medium">{PLANT_DATA[item.type].name}</div>
                    <div className="text-xs text-gray-600">{item.description}</div>
                  </div>
                </div>
                <Badge variant={serenityPoints >= item.price ? "default" : "secondary"}>
                  {item.price} pts
                </Badge>
              </div>
              <Button
                onClick={() => handlePurchase(item)}
                disabled={!item.unlocked || serenityPoints < item.price}
                className="w-full text-sm"
                variant={serenityPoints >= item.price ? "default" : "outline"}
              >
                {!item.unlocked ? '🔒 Verrouillé' : 
                 serenityPoints >= item.price ? '💳 Acheter' : '💸 Trop cher'}
              </Button>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              ❌ Fermer la Boutique
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shop;
