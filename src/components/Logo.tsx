import React from "react";

const Logo: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div className="flex items-center group">
      <div
        className="relative bg-gradient-to-br from-white to-gray-300 rounded-xl overflow-hidden shadow-lg group-hover:shadow-chat-accent/30 transition-shadow duration-300"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute transform rotate-45 bg-gradient-to-r from-chat-accent to-purple-700"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            left: size * 0.2,
            top: size * 0.2,
          }}
        />
      </div>
    </div>
  );
};

export default Logo;
