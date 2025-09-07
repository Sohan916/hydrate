import { useState, useEffect } from 'react';
import { Settings, DEFAULT_SETTINGS } from '@/src/types/settings';
import { StorageService } from '@/src/services/storage';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await StorageService.loadSettings();
      if (stored) {
        setSettings(stored);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await StorageService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return {
    settings,
    updateSettings,
    loadSettings,
  };
};