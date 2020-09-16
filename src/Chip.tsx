import React from 'react';

export interface ChipProps {
  selected?: boolean;
  onRemove?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ selected, onRemove, children }) => {
  return (
    <div
      className={`react-chips--chip${
        selected ? ' react-chips--chip__selected' : ''
      }`}
    >
      {children}
      <span className="react-chips--chip-remove" onClick={onRemove}>
        {' '}
        &times;
      </span>
    </div>
  );
};
