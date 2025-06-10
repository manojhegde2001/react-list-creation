import { useState } from 'react';
import { createList, fetchLists } from '../utils/api';
import { AnimalItem } from '../types/atom';

export const useListCreation = () => {
  const [lists, setLists] = useState<any>([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState<string | null>(null);

  const getLists = async () => {
    setStatus('loading');
    try {
      const data = await fetchLists();
      setLists(data);
      setStatus('succeeded');
    } catch (err:any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const addList = async (title: string, items: AnimalItem[]) => {
    setStatus('loading');
    try {
      const newList = await createList({ title, items });
      setLists((prev:any) => [...prev, newList]);
      setStatus('succeeded');
      return true;
    } catch (err:any) {
      setError(err.message);
      setStatus('failed');
      return false;
    }
  };

  return { lists, status, error, getLists, addList };
};