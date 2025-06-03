
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SettingsProps {
  soundEnabled: boolean;
  saveSlot: number;
  onSoundToggle: () => void;
  onSaveSlotChange: (slot: number) => void;
  onSaveGame: () => void;
  onLoadGame: (slot: number) => void;
  onExportSave: () => void;
  onImportSave: (saveData: string) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  soundEnabled,
  saveSlot,
  onSoundToggle,
  onSaveSlotChange,
  onSaveGame,
  onLoadGame,
  onExportSave,
  onImportSave,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[80vh] overflow-auto bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">⚙️ Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Son */}
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <div>
              <div className="font-medium">🔊 Sons</div>
              <div className="text-xs text-gray-600">Activer les effets sonores</div>
            </div>
            <Button
              onClick={onSoundToggle}
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* Slot de sauvegarde */}
          <div className="p-3 bg-white rounded-lg">
            <div className="font-medium mb-2">💾 Slot de Sauvegarde</div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(slot => (
                <Button
                  key={slot}
                  onClick={() => onSaveSlotChange(slot)}
                  variant={saveSlot === slot ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  Slot {slot}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions de sauvegarde */}
          <div className="space-y-2">
            <Button
              onClick={onSaveGame}
              className="w-full text-sm"
              variant="default"
            >
              💾 Sauvegarder le Jardin
            </Button>
            <Button
              onClick={() => onLoadGame(saveSlot)}
              className="w-full text-sm"
              variant="outline"
            >
              📂 Charger le Jardin
            </Button>
          </div>

          {/* Import/Export */}
          <div className="p-3 bg-white rounded-lg">
            <div className="font-medium mb-2">🔄 Sauvegarde Portable</div>
            <div className="space-y-2">
              <Button
                onClick={onExportSave}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                📤 Exporter
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      onImportSave(content);
                    };
                    reader.readAsText(file);
                  }
                }}
                className="hidden"
                id="import-save"
              />
              <Button
                onClick={() => document.getElementById('import-save')?.click()}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                📥 Importer
              </Button>
            </div>
          </div>

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

export default Settings;
