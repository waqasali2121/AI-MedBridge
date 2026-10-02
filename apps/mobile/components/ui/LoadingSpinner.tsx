import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  color?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  fullScreen = false,
  color = '#0D9488',
  size = 'large',
}) => {
  const content = (
    <View className="items-center justify-center p-4">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="mt-3 text-sm font-medium text-[#43474D] text-center">
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 bg-[#F8F9FF] items-center justify-center">
        {content}
      </View>
    );
  }

  return content;
};

export default LoadingSpinner;
