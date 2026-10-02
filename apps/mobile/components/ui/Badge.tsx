import React from 'react';
import { View, Text } from 'react-native';

export type BadgeStatus =
  | 'extracted'
  | 'confirmed'
  | 'verified'
  | 'clarification'
  | 'processing'
  | 'pending'
  | 'approved'
  | 'error';

interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'extracted':
        return {
          bg: 'bg-[#F0F9FF]',
          border: 'border-[#BAE6FD]',
          text: 'text-[#0369A1]',
          defaultLabel: 'Extracted',
        };
      case 'confirmed':
        return {
          bg: 'bg-[#F0FDF4]',
          border: 'border-[#BBF7D0]',
          text: 'text-[#15803D]',
          defaultLabel: 'Confirmed',
        };
      case 'verified':
      case 'approved':
        return {
          bg: 'bg-[#CCFBF1]',
          border: 'border-[#99F6E4]',
          text: 'text-[#0F766E]',
          defaultLabel: status === 'approved' ? 'Approved' : 'Verified',
        };
      case 'clarification':
      case 'pending':
        return {
          bg: 'bg-[#FFFBEB]',
          border: 'border-[#FDE68A]',
          text: 'text-[#B45309]',
          defaultLabel: status === 'pending' ? 'Pending Review' : 'Clarification Needed',
        };
      case 'processing':
        return {
          bg: 'bg-[#EFF6FF]',
          border: 'border-[#BFDBFE]',
          text: 'text-[#1D4ED8]',
          defaultLabel: 'Processing',
        };
      case 'error':
        return {
          bg: 'bg-[#FEF2F2]',
          border: 'border-[#FECACA]',
          text: 'text-[#B91C1C]',
          defaultLabel: 'Error',
        };
      default:
        return {
          bg: 'bg-[#F8F9FF]',
          border: 'border-[#C3C6CE]',
          text: 'text-[#43474D]',
          defaultLabel: status,
        };
    }
  };

  const badgeStyle = getBadgeStyle();
  const displayLabel = label || badgeStyle.defaultLabel;

  return (
    <View
      className={`px-3 py-1 rounded-full border flex-row items-center self-start ${badgeStyle.bg} ${badgeStyle.border} ${className}`}
    >
      <Text className={`text-xs font-semibold ${badgeStyle.text}`}>
        {displayLabel}
      </Text>
    </View>
  );
};

export default Badge;
