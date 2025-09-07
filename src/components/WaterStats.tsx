import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WaterStatsProps {
  waterCount: number;
}

export const WaterStats: React.FC<WaterStatsProps> = ({ waterCount }) => {
  return (
    <View className="px-5 mb-8">
      <View className="bg-primary/15 rounded-2xl p-5 items-center border border-primary/30">
        <Ionicons name="water-outline" size={30} color="#4FC3F7" />
        <Text className="text-primary text-3xl font-bold mt-2">{waterCount}</Text>
        <Text className="text-gray text-sm mt-1">glasses today</Text>
      </View>
    </View>
  );
};

