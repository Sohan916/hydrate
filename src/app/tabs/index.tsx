import { DrinkButton, TimerDisplay, WaterStats } from "@/src/components";
import { useSettings } from "@/src/hooks/useSettings";
import { useWaterCount } from "@/src/hooks/useWaterCount";
import { NotificationService } from "@/src/services/notifications";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  // States.
  const [timeLeft, setTimeLeft] = useState(0);
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null);
  const { settings } = useSettings();
  const { waterCount, incrementWaterCount, refreshWaterCount } = useWaterCount();

  // Helpers.
  const scheduleNextReminder = useCallback(async () => {
    const nextTime = await NotificationService.scheduleReminder(settings);
    setNextReminderTime(nextTime);
  }, [settings]);

  const updateCountdown = useCallback(() => {
    if (!nextReminderTime) return;

    const now = new Date().getTime();
    const distance = nextReminderTime.getTime() - now;

    if (distance > 0) {
      setTimeLeft(Math.floor(distance / 1000));
    } else {
      setTimeLeft(0);
      scheduleNextReminder();
    }
  }, [nextReminderTime, scheduleNextReminder]);

  const getProgressPercentage = () => {
    if (!nextReminderTime || timeLeft <= 0) return 100;
    const totalInterval = settings.intervalMinutes * 60;
    const elapsed = totalInterval - timeLeft;
    return Math.min(100, Math.max(0, (elapsed / totalInterval) * 100));
  };

  // Effects.
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (settings.isActive) {
      scheduleNextReminder();
    }
  }, [settings, scheduleNextReminder]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [nextReminderTime, updateCountdown]);

  // Refresh water count when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshWaterCount();
    }, [refreshWaterCount])
  );

  // Handlers.
  const handleDrinkWater = useCallback(async () => {
    await incrementWaterCount();
    scheduleNextReminder();
  }, [incrementWaterCount, scheduleNextReminder]);

  // Services.
  const requestNotificationPermission = async () => {
    const granted = await NotificationService.requestPermissions();
    if (!granted) {
      alert("You need to enable push notifications to get water reminders!");
    }
  };

  return (
    <View
      className={`flex-1 bg-background ${
        Platform.OS === "ios" ? "pt-12" : "pt-8"
      }`}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-2.5">
        <Text className="text-3xl font-bold text-primary">Hydrate Test</Text>
        <Link href="/tabs/settings" asChild>
          <TouchableOpacity className="p-2">
            <Ionicons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Main Timer Display */}
      <TimerDisplay
        timeLeft={timeLeft}
        progressPercentage={getProgressPercentage()}
      />

      {/* Water Count */}
      <WaterStats waterCount={waterCount} />

      {/* Action Buttons */}
      <View className="px-5 mb-5">
        <DrinkButton onPress={handleDrinkWater} />
      </View>

      {/* Active Status */}
      {settings.isActive && (
        <Text className="text-center text-primary text-sm mb-5">
          Reminders active from {settings.startHour}:00 to {settings.endHour}:00
        </Text>
      )}
      {!settings.isActive && (
        <Text className="text-center text-error text-sm mb-5">
          Reminders are paused - Enable in settings
        </Text>
      )}
    </View>
  );
}
