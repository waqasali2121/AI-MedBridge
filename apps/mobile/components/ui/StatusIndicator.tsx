import React from 'react';
import { View, Text } from 'react-native';

interface StatusIndicatorProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showDotOnly?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showDotOnly = false,
}) => {
  const getStatusConfig = (rawStatus: string) => {
    const s = rawStatus.toUpperCase();
    switch (s) {
      case 'PROCESSING':
        return { color: 'bg-[#1D4ED8]', text: 'text-[#1D4ED8]', label: 'Processing' };
      case 'EXTRACTED':
        return { color: 'bg-[#0369A1]', text: 'text-[#0369A1]', label: 'Extracted' };
      case 'CONFIRMED':
        return { color: 'bg-[#15803D]', text: 'text-[#15803D]', label: 'Confirmed' };
      case 'PENDING_REVIEW':
      case 'PENDING':
        return { color: 'bg-[#B45309]', text: 'text-[#B45309]', label: 'Pending Review' };
      case 'APPROVED':
        return { color: 'bg-[#0F766E]', text: 'text-[#0F766E]', label: 'Approved' };
      case 'CORRECTION_REQUIRED':
      case 'ERROR':
        return { color: 'bg-[#B91C1C]', text: 'text-[#B91C1C]', label: 'Correction Required' };
      default:
        return { color: 'bg-[#74777E]', text: 'text-[#74777E]', label: rawStatus };
    }
  };

  const config = getStatusConfig(status);

  const dotSize =
    size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  const textSize =
    size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <View className="flex-row items-center space-x-2">
      <View className={`rounded-full ${dotSize} ${config.color}`} />
      {!showDotOnly && (
        <Text className={`font-medium ${textSize} ${config.text}`}>
          {config.label}
        </Text>
      )}
    </View>
  );
};

export default StatusIndicator;
