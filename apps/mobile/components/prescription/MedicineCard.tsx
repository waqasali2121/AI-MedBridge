import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medicine } from '@/services/api';
import EditableField from './EditableField';

interface MedicineCardProps {
  medicine: Medicine;
  onUpdate?: (updatedData: Partial<Medicine>) => void;
  isEditable?: boolean;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onUpdate,
  isEditable = false,
}) => {
  const confidenceScore = medicine.confidence_score ?? 1;
  const confidencePercentage =
    confidenceScore <= 1 ? Math.round(confidenceScore * 100) : Math.round(confidenceScore);

  const handleFieldSave = (field: keyof Medicine, value: string) => {
    if (onUpdate) {
      onUpdate({
        [field]: value,
        source: 'user_edit',
      });
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-[#E5EEFF] shadow-sm">
      {/* Header section with Name & Badges */}
      <View className="flex-row justify-between items-start mb-3 pb-3 border-b border-gray-100">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="medical" size={18} color="#0D9488" className="mr-1.5" />
            <Text className="text-base font-bold text-[#0B1C30] ml-1">
              {medicine.medicine_name || 'Unnamed Medicine'}
            </Text>
          </View>
        </View>

        {/* Source Badge */}
        <View
          className={`px-2.5 py-1 rounded-full ${
            medicine.source === 'user_edit'
              ? 'bg-purple-50 border border-purple-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              medicine.source === 'user_edit' ? 'text-purple-700' : 'text-blue-700'
            }`}
          >
            {medicine.source === 'user_edit' ? 'User Edited' : 'AI Extracted'}
          </Text>
        </View>
      </View>

      {/* Overall Confidence Bar */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-xs font-medium text-gray-500">Overall Accuracy</Text>
          <Text className="text-xs font-bold text-gray-700">{confidencePercentage}%</Text>
        </View>
        <View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <View
            className={`h-full rounded-full ${
              confidencePercentage >= 80
                ? 'bg-emerald-500'
                : confidencePercentage >= 60
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, confidencePercentage))}%` }}
          />
        </View>
      </View>

      {/* Fields */}
      {isEditable ? (
        <View>
          <EditableField
            label="Medicine Name"
            value={medicine.medicine_name}
            confidence={medicine.confidence_score}
            onSave={(val) => handleFieldSave('medicine_name', val)}
          />
          <EditableField
            label="Dosage"
            value={medicine.dosage}
            confidence={medicine.confidence_score}
            onSave={(val) => handleFieldSave('dosage', val)}
          />
          <EditableField
            label="Frequency"
            value={medicine.frequency}
            confidence={medicine.confidence_score}
            onSave={(val) => handleFieldSave('frequency', val)}
          />
          <EditableField
            label="Duration"
            value={medicine.duration}
            confidence={medicine.confidence_score}
            onSave={(val) => handleFieldSave('duration', val)}
          />
          <EditableField
            label="Instructions"
            value={medicine.instructions}
            confidence={medicine.confidence_score}
            onSave={(val) => handleFieldSave('instructions', val)}
            multiline
          />
        </View>
      ) : (
        <View className="space-y-2">
          <View className="flex-row justify-between py-1 border-b border-gray-50">
            <Text className="text-xs text-gray-500">Dosage:</Text>
            <Text className="text-xs font-medium text-[#0B1C30]">{medicine.dosage || '-'}</Text>
          </View>
          <View className="flex-row justify-between py-1 border-b border-gray-50">
            <Text className="text-xs text-gray-500">Frequency:</Text>
            <Text className="text-xs font-medium text-[#0B1C30]">{medicine.frequency || '-'}</Text>
          </View>
          <View className="flex-row justify-between py-1 border-b border-gray-50">
            <Text className="text-xs text-gray-500">Duration:</Text>
            <Text className="text-xs font-medium text-[#0B1C30]">{medicine.duration || '-'}</Text>
          </View>
          {medicine.instructions ? (
            <View className="py-1">
              <Text className="text-xs text-gray-500 mb-0.5">Instructions:</Text>
              <Text className="text-xs font-medium text-[#0B1C30] bg-gray-50 p-2 rounded-lg">
                {medicine.instructions}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default MedicineCard;
