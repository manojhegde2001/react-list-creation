import React from 'react';
import { AnimalItem } from '../types/atom';

interface ListContainerProps {
  list?: {
    id: string;
    title?: React.ReactNode;
    items?: AnimalItem[];
  };
  items?: AnimalItem[];
  title?: React.ReactNode;
  direction?: 'left' | 'right' | 'both';
  onItemMove?: (item: AnimalItem) => void;
  onItemMoveLeft?: (item: AnimalItem) => void;
  onItemMoveRight?: (item: AnimalItem) => void;
}

const ListContainer: React.FC<ListContainerProps> = ({ 
  list, 
  items = list?.items, 
  title = list?.title,
  direction,
  onItemMove,
  onItemMoveLeft,
  onItemMoveRight
}) => {
  return (
    <div className="bg-blue-100 rounded-lg shadow-md overflow-hidden h-full border ">
      {title && (
        <div className="p-3 border-b ">
          <div className="font-semibold text-gray-800">{title}</div>
        </div>
      )}
      <div className="max-h-[500px] overflow-y-auto p-2">
        {items?.length ? (
          items.map(item => (
            <div key={item.id} className="flex items-center bg-white p-3 rounded-lg mb-2 shadow-sm">
              {(direction === 'left' || direction === 'both') && (
                <button 
                  onClick={() => direction === 'both' ? onItemMoveLeft?.(item) : onItemMove?.(item)}
                  className="text-gray-600 hover:text-blue-600 mr-2"
                  aria-label="Move left"
                >
                  ←
                </button>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{item.commonName}</p>
                <p className="text-sm text-gray-500 italic truncate">{item.scientificName}</p>
              </div>
              
              {(direction === 'right' || direction === 'both') && (
                <button 
                  onClick={() => direction === 'both' ? onItemMoveRight?.(item) : onItemMove?.(item)}
                  className="text-gray-600 hover:text-blue-600 ml-2"
                  aria-label="Move right"
                >
                  →
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 bg-white rounded-lg">
            No items in this list
          </div>
        )}
      </div>
    </div>
  );
};

export default ListContainer;