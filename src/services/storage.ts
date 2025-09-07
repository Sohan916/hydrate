import { STORAGE_KEYS } from "@/src/constants/storage";
import { Settings } from "@/src/types/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageService = {
  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  },

  async loadSettings(): Promise<Settings | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    }
  },

  async saveWaterCount(date: string, count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WATER_COUNT(date),
        count.toString()
      );
    } catch (error) {
      console.error("Error saving water count:", error);
      throw error;
    }
  },

  async loadWaterCount(date: string): Promise<number> {
    try {
      const key = STORAGE_KEYS.WATER_COUNT(date);
      console.log("Loading water count for key:", key);
      const stored = await AsyncStorage.getItem(key);
      console.log("Stored value:", stored);
      const count = stored ? parseInt(stored, 10) : 0;
      console.log("Parsed count:", count);
      return count;
    } catch (error) {
      console.error("Error loading water count:", error);
      return 0;
    }
  },

  async resetWaterCount(date: string): Promise<void> {
    try {
      console.log("Resetting water count for date:", date);
      const key = STORAGE_KEYS.WATER_COUNT(date);
      console.log("Storage key:", key);

      // Test AsyncStorage directly
      await AsyncStorage.setItem(key, "0");
      console.log("Direct AsyncStorage setItem completed");

      // Verify the value was set
      const storedValue = await AsyncStorage.getItem(key);
      console.log("Stored value after reset:", storedValue);

      console.log("Water count reset successfully");
    } catch (error) {
      console.error("Error resetting water count:", error);
      throw error;
    }
  },
};
