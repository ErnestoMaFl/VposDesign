import React from 'react';

interface PillSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export const PillSuggestions: React.FC<PillSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="shrink-0 px-4 py-2 bg-surface-low hover:bg-surface-container active:scale-95 transition-all duration-300 rounded-full font-utility text-xs text-on-surface-variant hover:text-on-surface whitespace-nowrap border border-surface-bright-edge/20 shadow-sm"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};