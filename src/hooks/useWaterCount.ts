import { StorageService } from "@/src/services/storage";
import { getTodayString } from "@/src/utils/time";
import { useEffect, useState } from "react";

export const useWaterCount = () => {
  const [waterCount, setWaterCount] = useState(0);

  useEffect(() => {
    loadWaterCount();
  }, []);

  const loadWaterCount = async () => {
    try {
      const today = getTodayString();
      const count = await StorageService.loadWaterCount(today);
      setWaterCount(count);
    } catch (error) {
      console.error("Error loading water count:", error);
    }
  };

  const incrementWaterCount = async () => {
    try {
      const newCount = waterCount + 1;
      const today = getTodayString();
      await StorageService.saveWaterCount(today, newCount);
      setWaterCount(newCount);
      return newCount;
    } catch (error) {
      console.error("Error incrementing water count:", error);
      throw error;
    }
  };

  const resetWaterCount = async () => {
    try {
      const today = getTodayString();
      console.log("Resetting water count for today:", today);
      console.log("Current water count before reset:", waterCount);

      await StorageService.resetWaterCount(today);

      // Force set to 0 first
      setWaterCount(0);
      console.log("Water count reset to 0 in state");

      // Wait a bit then reload to ensure state is synchronized
      setTimeout(async () => {
        console.log("Reloading water count after reset...");
        await loadWaterCount();
      }, 100);
    } catch (error) {
      console.error("Error resetting water count:", error);
      throw error;
    }
  };

  return {
    waterCount,
    incrementWaterCount,
    resetWaterCount,
    loadWaterCount,
  };
};
