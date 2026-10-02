import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UploadAreaProps {
  onSelectFile: () => void;
  onTakePhoto: () => void;
  isUploading?: boolean;
  progress?: number;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onSelectFile,
  onTakePhoto,
  isUploading = false,
  progress = 0,
}) => {
  return (
    <View className="border-2 border-dashed border-[#0D9488]/40 bg-teal-50/30 rounded-2xl p-6 items-center justify-center my-4">
      {isUploading ? (
        <View className="items-center py-4 w-full">
          <ActivityIndicator size="large" color="#0D9488" />
          <Text className="text-sm font-semibold text-[#0B1C30] mt-3">
            Uploading Prescription...
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Processing image & extracting details</Text>

          {progress > 0 && (
            <View className="w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <View
                className="h-full bg-[#0D9488] rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </View>
          )}
        </View>
      ) : (
        <View className="items-center w-full">
          <View className="w-16 h-16 rounded-full bg-[#0D9488]/10 items-center justify-center mb-3">
            <Ionicons name="cloud-upload-outline" size={32} color="#0D9488" />
          </View>

          <Text className="text-base font-bold text-[#0B1C30] text-center mb-1">
            Tap to upload prescription
          </Text>
          <Text className="text-xs text-gray-500 text-center mb-5">
            Supported: PDF, JPG, PNG (Max 10MB)
          </Text>

          <View className="flex-row justify-center space-x-3 w-full">
            <TouchableOpacity
              onPress={onSelectFile}
              className="flex-1 bg-[#0D9488] flex-row items-center justify-center py-3 px-4 rounded-xl shadow-sm mr-2"
            >
              <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">Choose File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onTakePhoto}
              className="flex-1 bg-[#0F2942] flex-row items-center justify-center py-3 px-4 rounded-xl shadow-sm ml-2"
            >
              <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default UploadArea;
