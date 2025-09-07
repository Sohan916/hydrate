import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DrinkButtonProps {
  onPress: () => void;
}

export const DrinkButton: React.FC<DrinkButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      className="bg-primary rounded-3xl py-4 px-8 flex-row items-center justify-center shadow-lg shadow-primary/30" 
      style={{
        shadowColor: '#4FC3F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      onPress={onPress}
    >
      <Ionicons name="water" size={24} color="white" />
      <Text className="text-white text-lg font-bold ml-2">I Drank Water!</Text>
    </TouchableOpacity>
  );
};

