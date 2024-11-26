import React from 'react';

interface BulletProps {
  position: { x: number; y: number };
}

export const Bullet: React.FC<BulletProps> = ({ position }) => {
  return (
    <div 
      className="absolute w-1 h-4 bg-yellow-400"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    ></div>
  );
};