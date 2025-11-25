import React from 'react';

interface SplitTitleProps {
  text: string;
  className?: string;
  highlight?: string; // word to highlight (e.g., Purpose)
}

export const SplitTitle: React.FC<SplitTitleProps> = ({ text, className = '', highlight }) => {
  // Split into words and characters
  const words = text.split(' ');

  return (
    <h1 className={`font-bold font-playfair leading-tight ${className}`} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-2">
          {word.split('').map((ch, i) => (
            <span
              key={`${wordIndex}-${i}`}
              className={`split-letter inline-block` + (highlight && highlight === word ? ' text-primary' : '')}
              style={{ animationDelay: `${(wordIndex * 0.12) + i * 0.02}s` }}
            >
              {ch}
            </span>
          ))}
          {/* preserve spaces visually */}
        </span>
      ))}
    </h1>
  );
};

export default SplitTitle;
