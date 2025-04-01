
import React from 'react';

type SuggestionTagsProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

const SuggestionTags: React.FC<SuggestionTagsProps> = ({ tags, onTagClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-4">
      {tags.map((tag, index) => (
        <button 
          key={index}
          onClick={() => onTagClick(tag)}
          className="tag-button"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default SuggestionTags;
