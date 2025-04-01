
import React from 'react';

type SuggestionTagsProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

const SuggestionTags: React.FC<SuggestionTagsProps> = ({ tags, onTagClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-4 animate-fade-in">
      {tags.map((tag, index) => (
        <button 
          key={index}
          onClick={() => onTagClick(tag)}
          className="bg-gray-800/60 text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-chat-accent/80 transition-colors duration-300 border border-gray-700/50"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default SuggestionTags;
