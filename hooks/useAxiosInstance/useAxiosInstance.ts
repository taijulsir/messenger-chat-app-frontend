import { useState } from 'react';
import axiosInstance from './axiosInstance';

const useAxiosInstance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (url: string, options: any = {}) => {
    setLoading(true);
    try {
      const response = await axiosInstance(url, options);
      setLoading(false);
      return response.data; // Return the response data
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err; // Propagate the error
    }
  };

  return { fetchData, loading, error };
};

export default useAxiosInstance;
