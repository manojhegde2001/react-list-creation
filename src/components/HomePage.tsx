import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ListContainer from './ListContainer';
import ListCreationView from './ListCreationView';
import { fetchListsAtom, listStateAtom } from '../types/atom';

const HomePage: React.FC = () => {
  const [state, setState] = useAtom(listStateAtom);
  const [, fetchLists] = useAtom(fetchListsAtom);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const toggleListSelection = (listNumber: number) => {
    setState(prev => {
      const selectedLists = prev.selectedLists.includes(listNumber)
        ? prev.selectedLists.filter(n => n !== listNumber)
        : [...prev.selectedLists, listNumber];

      return {
        ...prev,
        selectedLists,
        error: null
      };
    });
  };

  const handleCreateList = () => {
    if (state.selectedLists.length !== 2) {
      setState(prev => ({
        ...prev,
        error: 'You should select exactly 2 lists to create a new list'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      creationMode: true,
      newList: []
    }));
  };

  if (state.status === 'loading') return <LoadingSpinner />;
  if (state.status === 'failed') return <ErrorMessage message={state.error || 'Failed to load lists'} onRetry={fetchLists} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={handleCreateList}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={state.creationMode}
        >
          Create new list
        </button>
        {state.error && (
          <p className="mt-2 text-red-500 text-center">{state.error}</p>
        )}
      </div>
      
      {state.creationMode ? (
        <ListCreationView />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(state.lists).map(([listNumber, items]) => (
            <ListContainer
              key={listNumber}
              list={{
                id: `list-${listNumber}`,
                title: (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={state.selectedLists.includes(Number(listNumber))}
                      onChange={() => toggleListSelection(Number(listNumber))}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="font-medium">List {listNumber}</span>
                  </div>
                ),
                items: items || []
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;