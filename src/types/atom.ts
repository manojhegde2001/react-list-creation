import { atom } from 'jotai';

export interface AnimalItem {
  id: string;
  commonName: string;
  scientificName: string;
  listNumber: number;
}

export interface ListState {
  lists: {
    [key: number]: AnimalItem[];
  };
  selectedLists: number[];
  creationMode: boolean;
  newList: AnimalItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const listStateAtom = atom<ListState>({
  lists: {},
  selectedLists: [],
  creationMode: false,
  newList: [],
  status: 'idle',
  error: null
});

export const fetchListsAtom = atom(
  null,
  async (get, set) => {
    set(listStateAtom, prev => ({
      ...prev,
      status: 'loading',
      error: null
    }));
    
    try {
      const response = await fetch('https://apis.ccbp.in/list-creation/lists');
      const data = await response.json();
      
      // Transform API data to our structure
      const lists = data.lists.reduce((acc: any, animal: any) => {
        if (!acc[animal.list_number]) {
          acc[animal.list_number] = [];
        }
        acc[animal.list_number].push({
          id: animal.id,
          commonName: animal.name,
          scientificName: animal.description,
          listNumber: animal.list_number
        });
        return acc;
      }, {});
      
      set(listStateAtom, prev => ({
        ...prev,
        lists,
        status: 'succeeded'
      }));
    } catch (error) {
      set(listStateAtom, prev => ({
        ...prev,
        status: 'failed',
        error: 'Failed to load lists'
      }));
    }
  }
);