'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Leaf {
  id: number;
  x: number;
  y: number;
  emoji: string;
  angle: number;
  distance: number;
  duration: number;
  rotation: number;
  scale: number;
}

export function useLeafBurst() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  const triggerBurst = useCallback((originX?: number, originY?: number) => {
    const x = originX ?? window.innerWidth / 2;
    const y = originY ?? window.innerHeight / 2;

    const emojis = ['🍃', '🌿', '🌱', '☘️', '🍀', '💚'];
    const newLeaves: Leaf[] = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      angle: (360 / 14) * i + (Math.random() - 0.5) * 30,
      distance: 80 + Math.random() * 120,
      duration: 0.8 + Math.random() * 0.6,
      rotation: Math.random() * 720 - 360,
      scale: 0.6 + Math.random() * 0.8,
    }));

    setLeaves(newLeaves);

    // Auto cleanup
    setTimeout(() => setLeaves([]), 2000);
  }, []);

  return { leaves, triggerBurst };
}

interface LeafBurstOverlayProps {
  leaves: Leaf[];
}

export function LeafBurstOverlay({ leaves }: LeafBurstOverlayProps) {
  return (
    <div className="leaf-burst-container">
      <AnimatePresence>
        {leaves.map((leaf) => {
          const radians = (leaf.angle * Math.PI) / 180;
          const tx = Math.cos(radians) * leaf.distance;
          const ty = Math.sin(radians) * leaf.distance;

          return (
            <motion.div
              key={leaf.id}
              initial={{
                x: leaf.x,
                y: leaf.y,
                scale: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: leaf.x + tx,
                y: leaf.y + ty - 30,
                scale: leaf.scale,
                opacity: 0,
                rotate: leaf.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: leaf.duration,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'fixed',
                fontSize: '24px',
                pointerEvents: 'none',
                zIndex: 100,
              }}
            >
              {leaf.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
