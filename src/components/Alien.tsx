import React from 'react';

interface AlienProps {
  position: { x: number; y: number };
}

export const Alien: React.FC<AlienProps> = ({ position }) => {
  return (
    <div 
      className="absolute w-8 h-8 bg-purple-500"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="w-2 h-2 bg-purple-300 absolute top-1 left-1"></div>
      <div className="w-2 h-2 bg-purple-300 absolute top-1 right-1"></div>
    </div>
  );
};