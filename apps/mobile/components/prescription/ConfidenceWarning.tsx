import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfidenceWarningProps {
  confidence: number; // 0 to 1 or 0 to 100
  field: string;
  message?: string;
}

export const ConfidenceWarning: React.FC<ConfidenceWarningProps> = ({
  confidence,
  field,
  message,
}) => {
  // Normalize confidence to 0-100 scale
  const confidencePercentage =
    confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);

  if (confidencePercentage >= 80) {
    return null;
  }

  const defaultMessage = `Low confidence field (${confidencePercentage}%). Please check carefully.`;

  return (
    <View className="flex-row items-center bg-amber-50 border border-amber-200 rounded-xl p-3 my-1">
      <Ionicons name="warning-outline" size={20} color="#D97706" />
      <View className="ml-2.5 flex-1">
        <Text className="text-amber-900 font-medium text-xs">
          {field ? `${field}: ` : ''}
          {message || defaultMessage}
        </Text>
      </View>
    </View>
  );
};

export default ConfidenceWarning;
