
import React, { useState, useEffect } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  opacity: number;
}

interface ParticleEffectProps {
  trigger: number;
  type: 'water' | 'plant' | 'harvest' | 'visitor';
  position?: { x: number; y: number };
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ trigger, type, position }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getEmoji = () => {
    switch (type) {
      case 'water': return ['💧', '💦', '🌊'];
      case 'plant': return ['🌱', '✨', '🌿'];
      case 'harvest': return ['✨', '🌟', '💖'];
      case 'visitor': return ['✨', '🦋', '🌸'];
      default: return ['✨'];
    }
  };

  useEffect(() => {
    if (trigger > 0) {
      const emojis = getEmoji();
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: `particle-${Date.now()}-${i}`,
          x: (position?.x || 50) + (Math.random() - 0.5) * 20,
          y: (position?.y || 50) + (Math.random() - 0.5) * 20,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          opacity: 1
        });
      }
      
      setParticles(newParticles);
      
      // Animate particles
      setTimeout(() => {
        setParticles(prev => prev.map(p => ({
          ...p,
          y: p.y - 30,
          opacity: 0
        })));
      }, 100);
      
      // Remove particles
      setTimeout(() => {
        setParticles([]);
      }, 1000);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-2xl transition-all duration-1000 ease-out"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) scale(${particle.opacity})`
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

export default ParticleEffect;
