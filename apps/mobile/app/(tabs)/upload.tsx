import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { SafeView } from '@/components/layout/SafeView';
import { UploadArea } from '@/components/prescription/UploadArea';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { useLanguage } from '@/hooks/useLanguage';
import { MAX_FILE_SIZE_MB, SUPPORTED_FILE_TYPES } from '@/constants/config';

export default function UploadScreen() {
  const { t } = useLanguage();
  const { uploadPrescription } = usePrescriptionStore();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (fileUri: string, fileName: string, fileType: string, fileSize?: number) => {
    if (fileSize && fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(t('upload.fileTooLarge') || `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setProgress(0.2);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName || 'prescription.pdf',
        type: fileType || 'application/pdf',
      } as any);

      setProgress(0.6);
      const prescription = await uploadPrescription(formData);
      setProgress(1.0);

      setTimeout(() => {
        setIsUploading(false);
        router.push(`/prescription/${prescription.id}/review`);
      }, 500);
    } catch (error: any) {
      setIsUploading(false);
      const msg = error?.response?.data?.detail || error?.message || t('upload.uploadError');
      setErrorMessage(msg);
      Alert.alert(t('common.error'), msg);
    }
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        await handleFileUpload(asset.uri, asset.name, asset.mimeType || 'application/pdf', asset.size);
      }
    } catch (err) {
      Alert.alert(t('common.error'), 'Failed to select document');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(t('common.error'), t('upload.cameraPermission') || 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.uri.split('/').pop() || 'photo.jpg';
        await handleFileUpload(asset.uri, fileName, 'image/jpeg', asset.fileSize);
      }
    } catch (err) {
      Alert.alert(t('common.error'), 'Failed to launch camera');
    }
  };

  return (
    <SafeView className="bg-[#F8F9FF]">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-[#0F2942] mb-1">
          {t('upload.title')}
        </Text>
        <Text className="text-sm text-[#43474D] mb-6">
          Upload or take a photo of your doctor's handwritten or printed prescription.
        </Text>

        {errorMessage && (
          <View className="mb-4 bg-red-50 border border-red-200 p-3 rounded-xl">
            <Text className="text-xs text-red-700 font-medium">{errorMessage}</Text>
          </View>
        )}

        <UploadArea
          onSelectFile={handleSelectFile}
          onTakePhoto={handleTakePhoto}
          isUploading={isUploading}
          progress={progress}
        />
      </ScrollView>
    </SafeView>
  );
}
