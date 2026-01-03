import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Detecting location...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAddressFromCoords = async (lat, lng) => {
    try {
      // Using a free reverse geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.address) {
        const { suburb, city, town, village, state, country } = data.address;
        const locality = suburb || city || town || village || '';
        const region = state || '';
        return `${locality}${locality && region ? ', ' : ''}${region}`;
      }
      return 'Location detected';
    } catch (err) {
      console.error('Error getting address:', err);
      return 'Location detected';
    }
  };

  const detectLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setAddress('Location not available');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        const addr = await getAddressFromCoords(latitude, longitude);
        setAddress(addr);
        setLoading(false);
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Unable to retrieve your location');
        setAddress('Enable location access');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const value = {
    location,
    address,
    loading,
    error,
    detectLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
