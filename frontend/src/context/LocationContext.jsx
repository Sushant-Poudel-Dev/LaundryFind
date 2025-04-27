import { createContext, useState, useEffect, useContext } from "react";
import { getCityFromUserLocation } from "../utils/getCurrentCity";

// Create the context
const LocationContext = createContext();

// Custom hook for using location context
export const useLocation = () => useContext(LocationContext);

// Provider component
export const LocationProvider = ({ children }) => {
  const [userCity, setUserCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        setIsLoading(true);
        const city = await getCityFromUserLocation();
        setUserCity(city);
      } catch (error) {
        console.error("Error getting user location:", error);
        setError("Unable to determine your location");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  const value = {
    userCity,
    isLocationLoading: isLoading,
    locationError: error,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
