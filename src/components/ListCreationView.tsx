import React from 'react';
import { useAtom } from 'jotai';
import ListContainer from './ListContainer';
import { AnimalItem, listStateAtom } from '../types/atom';

const ListCreationView: React.FC = () => {
  const [state, setState] = useAtom(listStateAtom);
  const [firstList, secondList] = state.selectedLists;

  const handleItemMove = (item: AnimalItem, fromList: number, toList: number) => {
    setState(prev => {
      // Create deep copies of the state
      const updatedLists = JSON.parse(JSON.stringify(prev.lists));
      const updatedNewList = [...prev.newList];
      
      // Remove from source list
      if (fromList === 0) {
        // From new list
        const itemIndex = updatedNewList.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
          updatedNewList.splice(itemIndex, 1);
        }
      } else {
        // From existing list
        updatedLists[fromList] = updatedLists[fromList].filter((i:any) => i.id !== item.id);
      }
      
      // Add to target list
      if (toList === 0) {
        // To new list
        updatedNewList.push({...item, listNumber: 0});
      } else {
        // To existing list
        if (!updatedLists[toList]) updatedLists[toList] = [];
        updatedLists[toList].push({...item, listNumber: toList});
      }
      
      return {
        ...prev,
        lists: updatedLists,
        newList: updatedNewList
      };
    });
  };

  const handleCancel = () => {
    setState(prev => ({
      ...prev,
      creationMode: false,
      newList: [],
      selectedLists: []
    }));
  };

  const handleUpdate = () => {
    setState(prev => {
      const updatedLists = {...prev.lists};
      const newListNumber = Math.max(...Object.keys(prev.lists).map(Number)) + 1;
      
      // Add the new list between the selected lists
      updatedLists[newListNumber] = [...prev.newList].map(item => ({
        ...item,
        listNumber: newListNumber
      }));
      
      return {
        ...prev,
        lists: updatedLists,
        creationMode: false,
        newList: [],
        selectedLists: []
      };
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center">Create new list</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ListContainer 
          list={{
            id: `list-${firstList}`,
            title: `List ${firstList}`,
            items: state.lists[firstList] || []
          }}
          direction="right"
          onItemMove={(item) => handleItemMove(item, firstList, 0)}
        />
        
        <ListContainer 
          list={{
            id: 'new-list',
            title: 'New List',
            items: state.newList
          }}
          direction="both"
          onItemMoveLeft={(item) => handleItemMove(item, 0, firstList)}
          onItemMoveRight={(item) => handleItemMove(item, 0, secondList)}
        />
        
        <ListContainer 
          list={{
            id: `list-${secondList}`,
            title: `List ${secondList}`,
            items: state.lists[secondList] || []
          }}
          direction="left"
          onItemMove={(item) => handleItemMove(item, secondList, 0)}
        />
      </div>
      
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleCancel}
          className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ListCreationView;