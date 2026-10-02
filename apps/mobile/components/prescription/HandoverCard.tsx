import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HandoverCardProps {
  medicineName: string;
  instruction: string;
  schedule: string;
  duration: string;
  warnings?: string[];
  reviewStatus?: string; // 'PENDING_REVIEW' | 'APPROVED' | 'CORRECTION_REQUIRED' | 'EXTRACTED'
  isUrdu?: boolean;
}

export const HandoverCard: React.FC<HandoverCardProps> = ({
  medicineName,
  instruction,
  schedule,
  duration,
  warnings = [],
  reviewStatus = 'PENDING_REVIEW',
  isUrdu = false,
}) => {
  const getStatusBadge = () => {
    switch (reviewStatus?.toUpperCase()) {
      case 'APPROVED':
        return {
          label: isUrdu ? 'تصدیق شدہ' : 'Approved by Pharmacist',
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          icon: 'checkmark-circle' as const,
          color: '#059669',
        };
      case 'CORRECTION_REQUIRED':
        return {
          label: isUrdu ? 'تصحیح کی ضرورت ہے' : 'Correction Required',
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: 'alert-circle' as const,
          color: '#D97706',
        };
      default:
        return {
          label: isUrdu ? 'فارماسسٹ کا جائزہ جاری ہے' : 'Pending Review',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: 'time' as const,
          color: '#2563EB',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border border-[#E5EEFF] shadow-sm">
      {/* Header: Medicine Name & Status */}
      <View
        className={`flex-row justify-between items-start mb-4 pb-3 border-b border-gray-100 ${
          isUrdu ? 'flex-row-reverse' : ''
        }`}
      >
        <View className={`flex-1 ${isUrdu ? 'items-end ml-2' : 'items-start mr-2'}`}>
          <Text className={`text-lg font-bold text-[#0B1C30] ${isUrdu ? 'text-right' : 'text-left'}`}>
            {medicineName}
          </Text>
          {duration ? (
            <Text className={`text-xs text-gray-500 mt-0.5 ${isUrdu ? 'text-right' : 'text-left'}`}>
              {isUrdu ? `دورانیہ: ${duration}` : `Duration: ${duration}`}
            </Text>
          ) : null}
        </View>

        {/* Status Badge */}
        <View
          className={`flex-row items-center px-3 py-1.5 rounded-full border ${status.bg} ${status.border}`}
        >
          <Ionicons name={status.icon} size={14} color={status.color} />
          <Text className={`text-xs font-semibold ml-1.5 ${status.text}`}>{status.label}</Text>
        </View>
      </View>

      {/* Schedule / Timing */}
      <View className={`mb-3 bg-teal-50/50 p-3 rounded-xl border border-teal-100/50 ${isUrdu ? 'items-end' : ''}`}>
        <View className={`flex-row items-center mb-1 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <Ionicons name="time-outline" size={16} color="#0D9488" />
          <Text
            className={`text-xs font-bold text-[#0D9488] ${
              isUrdu ? 'mr-1.5 text-right' : 'ml-1.5 text-left'
            }`}
          >
            {isUrdu ? 'اووقات اور طریقہ' : 'Schedule & Timing'}
          </Text>
        </View>
        <Text
          className={`text-sm font-semibold text-[#0B1C30] mt-0.5 ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          {schedule || (isUrdu ? 'ہدایات کے مطابق لیں' : 'Take as directed')}
        </Text>
      </View>

      {/* Special Instructions */}
      {instruction ? (
        <View className={`mb-3 bg-gray-50 p-3 rounded-xl ${isUrdu ? 'items-end' : ''}`}>
          <View className={`flex-row items-center mb-1 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <Ionicons name="information-circle-outline" size={16} color="#43474D" />
            <Text
              className={`text-xs font-bold text-[#43474D] ${
                isUrdu ? 'mr-1.5 text-right' : 'ml-1.5 text-left'
              }`}
            >
              {isUrdu ? 'خاص ہدایات' : 'Instructions'}
            </Text>
          </View>
          <Text
            className={`text-xs text-gray-700 leading-relaxed ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
          >
            {instruction}
          </Text>
        </View>
      ) : null}

      {/* Warnings & Caution */}
      {warnings && warnings.length > 0 ? (
        <View className={`bg-rose-50 p-3 rounded-xl border border-rose-100 ${isUrdu ? 'items-end' : ''}`}>
          <View className={`flex-row items-center mb-1 ${isUrdu ? 'flex-row-reverse' : ''}`}>
            <Ionicons name="warning-outline" size={16} color="#BA1A1A" />
            <Text
              className={`text-xs font-bold text-[#BA1A1A] ${
                isUrdu ? 'mr-1.5 text-right' : 'ml-1.5 text-left'
              }`}
            >
              {isUrdu ? 'اہم احتیاطی تدابیر' : 'Safety Warnings'}
            </Text>
          </View>
          {warnings.map((warn, index) => (
            <Text
              key={index}
              className={`text-xs text-rose-900 mt-0.5 ${isUrdu ? 'text-right' : 'text-left'}`}
            >
              • {warn}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default HandoverCard;
