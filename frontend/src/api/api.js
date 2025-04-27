import axios from "axios";

const API_URL = "http://localhost:8000";

export const getAllStores = async () => {
  try {
    const response = await axios.get(`${API_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const getStoreById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching store with id ${id}:`, error);
    throw error;
  }
};

export const getStoresByCity = async (city) => {
  try {
    const response = await axios.get(`${API_URL}/stores/city/${city}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stores for city ${city}:`, error);
    throw error;
  }
};

export const searchStores = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/stores/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching stores with query ${query}:`, error);
    throw error;
  }
};
