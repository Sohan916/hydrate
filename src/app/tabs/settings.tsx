import { useSettings } from "@/src/hooks/useSettings";
import { useWaterCount } from "@/src/hooks/useWaterCount";
import { HOUR_OPTIONS, INTERVAL_OPTIONS } from "@/src/types/settings";
import { formatHour } from "@/src/utils/time";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { resetWaterCount } = useWaterCount();

  const updateInterval = async (minutes: number) => {
    const newSettings = { ...settings, intervalMinutes: minutes };
    try {
      await updateSettings(newSettings);
    } catch {
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const updateStartHour = async (hour: number) => {
    if (hour >= settings.endHour) {
      Alert.alert("Invalid Time", "Start time must be before end time");
      return;
    }
    const newSettings = { ...settings, startHour: hour };
    try {
      await updateSettings(newSettings);
    } catch {
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const updateEndHour = async (hour: number) => {
    if (hour <= settings.startHour) {
      Alert.alert("Invalid Time", "End time must be after start time");
      return;
    }
    const newSettings = { ...settings, endHour: hour };
    try {
      await updateSettings(newSettings);
    } catch {
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const toggleActive = async (isActive: boolean) => {
    const newSettings = { ...settings, isActive };
    try {
      await updateSettings(newSettings);
    } catch {
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const resetDailyCount = async () => {
    Alert.alert(
      "Reset Daily Count",
      "Are you sure you want to reset today's water count?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetWaterCount();
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Header */}
      <View
        className={`flex-row justify-between items-center px-5 py-4 ${
          Platform.OS === "ios" ? "pt-16" : "pt-10"
        }`}
      >
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-primary">Settings</Text>
        <View className="w-10" />
      </View>

      {/* Main Settings */}
      <View className="p-5">
        {/* Active Toggle */}
        <View className="bg-primary/10 rounded-2xl p-5 mb-5 border border-primary/20">
          <View className="flex-row items-center mb-4">
            <Ionicons name="notifications" size={24} color="#4FC3F7" />
            <Text className="text-lg font-bold text-white ml-3">Reminders</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-white">Enable Notifications</Text>
            <Switch
              value={settings.isActive}
              onValueChange={toggleActive}
              trackColor={{ false: "#767577", true: "#4FC3F7" }}
              thumbColor={settings.isActive ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Reminder Interval */}
        <View className="bg-primary/10 rounded-2xl p-5 mb-5 border border-primary/20">
          <View className="flex-row items-center mb-4">
            <Ionicons name="time" size={24} color="#4FC3F7" />
            <Text className="text-lg font-bold text-white ml-3">
              Reminder Interval
            </Text>
          </View>
          <Text className="text-sm text-gray mb-4 leading-5">
            How often you want to be reminded to drink water
          </Text>
          <View className="flex-row flex-wrap gap-2.5">
            {INTERVAL_OPTIONS.map((interval) => (
              <TouchableOpacity
                key={interval}
                className={`bg-white/10 rounded-xl py-3 px-5 border border-white/20 ${
                  settings.intervalMinutes === interval
                    ? "bg-primary border-primary"
                    : ""
                }`}
                onPress={() => updateInterval(interval)}
              >
                <Text
                  className={`text-white text-base ${
                    settings.intervalMinutes === interval
                      ? "font-bold"
                      : "font-medium"
                  }`}
                >
                  {interval < 60 ? `${interval}m` : `${interval / 60}h`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Hours */}
        <View className="bg-primary/10 rounded-2xl p-5 mb-5 border border-primary/20">
          <View className="flex-row items-center mb-4">
            <Ionicons name="sunny" size={24} color="#4FC3F7" />
            <Text className="text-lg font-bold text-white ml-3">
              Active Hours
            </Text>
          </View>
          <Text className="text-sm text-gray mb-4 leading-5">
            Set the hours during which you want to receive reminders
          </Text>

          {/* Start Hour */}
          <View className="mb-5">
            <Text className="text-base text-white mb-2.5">Start Time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {HOUR_OPTIONS.map((hour) => (
                <TouchableOpacity
                  key={`start-${hour}`}
                  className={`bg-white/10 rounded-lg py-2 px-3 mr-2 border border-white/20 ${
                    settings.startHour === hour
                      ? "bg-primary border-primary"
                      : ""
                  }`}
                  onPress={() => updateStartHour(hour)}
                >
                  <Text
                    className={`text-white text-sm ${
                      settings.startHour === hour ? "font-bold" : ""
                    }`}
                  >
                    {formatHour(hour)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* End Hour */}
          <View className="mb-5">
            <Text className="text-base text-white mb-2.5">End Time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {HOUR_OPTIONS.map((hour) => (
                <TouchableOpacity
                  key={`end-${hour}`}
                  className={`bg-white/10 rounded-lg py-2 px-3 mr-2 border border-white/20 ${
                    settings.endHour === hour ? "bg-primary border-primary" : ""
                  }`}
                  onPress={() => updateEndHour(hour)}
                >
                  <Text
                    className={`text-white text-sm ${
                      settings.endHour === hour ? "font-bold" : ""
                    }`}
                  >
                    {formatHour(hour)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Daily Summary */}
        <View className="bg-primary/10 rounded-2xl p-5 mb-5 border border-primary/20">
          <View className="flex-row items-center mb-4">
            <Ionicons name="bar-chart" size={24} color="#4FC3F7" />
            <Text className="text-lg font-bold text-white ml-3">
              Daily Summary
            </Text>
          </View>
          <Text className="text-sm text-light-gray leading-5 mb-2">
            With your current settings, you&apos;ll be reminded every{" "}
            <Text className="text-primary font-bold">
              {settings.intervalMinutes < 60
                ? `${settings.intervalMinutes} minutes`
                : `${settings.intervalMinutes / 60} hour${
                    settings.intervalMinutes > 60 ? "s" : ""
                  }`}
            </Text>{" "}
            between{" "}
            <Text className="text-primary font-bold">
              {formatHour(settings.startHour)}
            </Text>{" "}
            and{" "}
            <Text className="text-primary font-bold">
              {formatHour(settings.endHour)}
            </Text>
            .
          </Text>
          <Text className="text-sm text-light-gray leading-5 mb-2">
            That&apos;s approximately{" "}
            <Text className="text-primary font-bold">
              {Math.floor(
                ((settings.endHour - settings.startHour) * 60) /
                  settings.intervalMinutes
              )}
            </Text>{" "}
            reminders per day.
          </Text>
        </View>

        {/* Reset Data */}
        <View className="bg-primary/10 rounded-2xl p-5 mb-5 border border-primary/20">
          <View className="flex-row items-center mb-4">
            <Ionicons name="refresh" size={24} color="#ff6b6b" />
            <Text
              className="text-lg font-bold ml-3"
              style={{ color: "#ff6b6b" }}
            >
              Reset Data
            </Text>
          </View>
          <TouchableOpacity
            className="bg-error/20 rounded-xl py-3 items-center border border-error mt-2.5"
            onPress={resetDailyCount}
          >
            <Text className="text-error text-base font-semibold">
              Reset Today&apos;s Count
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
