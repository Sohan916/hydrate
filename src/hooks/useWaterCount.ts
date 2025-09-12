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
    const newCount = waterCount + 1;
    const today = getTodayString();
    await StorageService.saveWaterCount(today, newCount);
    setWaterCount(newCount);
    return newCount;
  };

  const resetWaterCount = async () => {
    try {
      const today = getTodayString();
      await StorageService.resetWaterCount(today);
      setWaterCount(0);
      // Also reload to ensure we're synchronized with storage
      await loadWaterCount();
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
    refreshWaterCount: loadWaterCount,
  };
};
