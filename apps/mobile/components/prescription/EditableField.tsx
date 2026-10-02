import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfidenceWarning from './ConfidenceWarning';

interface EditableFieldProps {
  label: string;
  value: string;
  confidence: number; // 0 to 1 or 0 to 100
  onSave: (newValue: string) => void;
  multiline?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  confidence,
  onSave,
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(value);

  const confidencePercentage =
    confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);

  const handleSave = () => {
    onSave(textValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTextValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View className="mb-3 bg-white p-3 rounded-xl border border-[#0D9488]">
        <Text className="text-xs font-semibold text-[#0B1C30] mb-1.5">{label}</Text>
        <TextInput
          value={textValue}
          onChangeText={setTextValue}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          className="border border-gray-300 rounded-lg p-2 text-sm text-[#0B1C30] bg-gray-50 mb-3"
          textAlignVertical={multiline ? 'top' : 'center'}
          autoFocus
        />
        <View className="flex-row justify-end space-x-2">
          <TouchableOpacity
            onPress={handleCancel}
            className="px-3 py-1.5 rounded-lg border border-gray-300 mr-2"
          >
            <Text className="text-xs font-medium text-gray-700">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="px-3 py-1.5 rounded-lg bg-[#0D9488]"
          >
            <Text className="text-xs font-medium text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-3 bg-surface-container-low p-3 rounded-xl border border-gray-100">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-xs font-semibold text-gray-500">{label}</Text>
        <View className="flex-row items-center">
          <View
            className={`px-2 py-0.5 rounded-full mr-2 ${
              confidencePercentage >= 80
                ? 'bg-green-100'
                : confidencePercentage >= 60
                ? 'bg-amber-100'
                : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                confidencePercentage >= 80
                  ? 'text-green-800'
                  : confidencePercentage >= 60
                  ? 'text-amber-800'
                  : 'text-red-800'
              }`}
            >
              {confidencePercentage}% confidence
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsEditing(true)} className="p-1">
            <Ionicons name="pencil" size={16} color="#0D9488" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-sm font-medium text-[#0B1C30]">
        {value || <Text className="italic text-gray-400">Not specified</Text>}
      </Text>

      {confidencePercentage < 70 && (
        <ConfidenceWarning confidence={confidence} field={label} />
      )}
    </View>
  );
};

export default EditableField;
