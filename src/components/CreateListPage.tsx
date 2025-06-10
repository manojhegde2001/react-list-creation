import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useListCreation } from '../hooks/useListCreation';
import ListContainer from '../components/ListContainer';
import { AnimalItem } from '../types/atom';

// Sample data from the image
const SAMPLE_ITEMS: AnimalItem[] = [];

const CreateListPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [selectedItems, setSelectedItems] = useState<AnimalItem[]>([]);
  const [availableItems, setAvailableItems] = useState<AnimalItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { status, error, addList } = useListCreation();

  useEffect(() => {
    // In a real app, you would fetch these from an API
    setAvailableItems(SAMPLE_ITEMS);
  }, []);

  const handleAddItem = (item: AnimalItem) => {
    setSelectedItems(prev => [...prev, item]);
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleRemoveItem = (id: string) => {
    const itemToRemove = selectedItems.find(item => item.id === id);
    if (itemToRemove) {
      setSelectedItems(prev => prev.filter(item => item.id !== id));
      setAvailableItems(prev => [...prev, itemToRemove]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedItems.length === 0) return;
    
    const success = await addList(title, selectedItems);
    if (success) {
      navigate('/');
    }
  };

  const filteredAvailableItems = availableItems.filter(item =>
    item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a new list</h2>
      
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            List Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">Available Items</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              {filteredAvailableItems.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredAvailableItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleAddItem(item)}
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="font-medium text-gray-800">{item.commonName}</p>
                      <p className="text-sm text-gray-500 italic">{item.scientificName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No available items</div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">Selected Items ({selectedItems.length})</h3>
            </div>
            
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || selectedItems.length === 0}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create List
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListPage;