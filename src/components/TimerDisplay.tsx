import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '@/src/utils/time';
import { DIMENSIONS } from '@/src/constants/theme';

const { width } = Dimensions.get('window');

interface TimerDisplayProps {
  timeLeft: number;
  progressPercentage: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timeLeft, 
  progressPercentage 
}) => {
  return (
    <View className="flex-1 justify-center items-center py-10">
      <View
        className="justify-center items-center bg-primary/10"
        style={{
          width: width * DIMENSIONS.TIMER_RATIO,
          height: width * DIMENSIONS.TIMER_RATIO,
          borderRadius: (width * DIMENSIONS.TIMER_RATIO) / 2,
          borderWidth: 8,
          borderColor: `rgba(79, 195, 247, ${
            0.3 + progressPercentage * 0.007
          })`,
        }}
      >
        <View className="items-center">
          <Ionicons name="water" size={60} color="#4FC3F7" />
          <Text className="text-white text-4xl font-bold mt-4">{formatTime(timeLeft)}</Text>
          <Text className="text-gray text-base mt-2">until next drink</Text>
        </View>
      </View>
    </View>
  );
};

