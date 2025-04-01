
import React from 'react';

const Logo: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div className="flex items-center">
      <div 
        className="relative bg-gradient-to-r from-chat-accent to-indigo-600 rounded-lg overflow-hidden shadow-lg" 
        style={{ width: size, height: size }}
      >
        <div className="absolute transform rotate-45 bg-white/20" 
          style={{ 
            width: size * 0.6, 
            height: size * 0.6, 
            left: size * 0.2, 
            top: size * 0.2 
          }} 
        />
      </div>
      <span className="ml-2 font-bold text-white text-lg">CLAI</span>
    </div>
  );
};

export default Logo;
