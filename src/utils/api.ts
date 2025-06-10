import axios from 'axios';
import { AnimalItem } from '../types/atom';

const API_BASE_URL = 'https://apis.ccbp.in/list-creation';

export const createList = async (listData: { title: string; items: AnimalItem[] }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/lists`, listData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lists`);
    return response.data;
  } catch (error) {
    throw error;
  }
};