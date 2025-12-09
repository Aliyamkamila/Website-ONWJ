import React, { createContext, useContext, useState, useEffect } from 'react';
import settingService from '../services/settingService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    company: {},
    social_media: {},
    contact: {},
    operating_hours: {},
    seo:  {},
    footer: {},
    logo: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingService.getAll();
      if (response.data. success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export { SettingsContext };