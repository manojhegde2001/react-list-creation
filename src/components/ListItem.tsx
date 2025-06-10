import React from 'react';
import { AnimalItem } from '../types/atom';

interface ListItemProps {
  item: AnimalItem;
  onRemove?: (id: string) => void;
  isRemovable?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ item, onRemove, isRemovable = false }) => {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{item.commonName}</p>
        <p className="text-sm text-gray-500 italic truncate">{item.scientificName}</p>
      </div>
      {isRemovable && onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
          aria-label={`Remove ${item.commonName}`}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ListItem;