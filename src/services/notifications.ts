import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Settings } from '@/src/types/settings';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("water-reminders", {
        name: "Water Reminders",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4FC3F7",
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  },

  async scheduleReminder(settings: Settings): Promise<Date | null> {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.isActive) return null;

    const now = new Date();
    const currentHour = now.getHours();

    // If outside active hours, schedule for next day
    if (currentHour < settings.startHour || currentHour >= settings.endHour) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(settings.startHour, 0, 0, 0);
      return tomorrow;
    }

    // Schedule next reminder within active hours
    const nextReminder = new Date(
      now.getTime() + settings.intervalMinutes * 60000
    );

    // If next reminder is outside active hours, schedule for next day
    if (nextReminder.getHours() >= settings.endHour) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(settings.startHour, 0, 0, 0);
      return tomorrow;
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Time to Hydrate!",
          body: "Don't forget to drink some water! Your body needs hydration.",
          data: { type: "waterReminder" },
        },
        trigger: {
          seconds: settings.intervalMinutes * 60,
        },
      });
      return nextReminder;
    }
  },

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};