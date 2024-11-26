import React from 'react';

interface PlayerProps {
  position: { x: number };
  onMove: (direction: 'left' | 'right') => void;
}

export const Player: React.FC<PlayerProps> = ({ position, onMove }) => {
  return (
    <div 
      className="absolute bottom-4 w-12 h-8 bg-green-500"
      style={{ left: `${position.x}px` }}
    >
      <div className="w-2 h-4 bg-green-600 absolute -top-4 left-5"></div>
    </div>
  );
};