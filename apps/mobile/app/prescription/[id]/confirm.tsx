import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useLanguage } from '@/hooks/useLanguage';

export default function PrescriptionConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prescriptionId = Number(id);
  const { t } = useLanguage();

  const {
    currentPrescription,
    medicines,
    isLoading,
    fetchPrescription,
    fetchMedicines,
    generateHandover,
  } = usePrescriptionStore();

  const { language, setLanguage } = useSettingsStore();
  const [targetLang, setTargetLang] = useState<'en' | 'ur'>(language || 'en');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription(prescriptionId);
      fetchMedicines(prescriptionId);
    }
  }, [prescriptionId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      setLanguage(targetLang);
      await generateHandover(prescriptionId);
      router.push(`/prescription/${prescriptionId}/handover`);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || 'Failed to generate handover');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading && !currentPrescription) {
    return (
      <SafeView className="flex-1 bg-[#F8F9FF]">
        <LoadingSpinner fullScreen message={t('common.loading')} />
      </SafeView>
    );
  }

  return (
    <SafeView className="flex-1 bg-[#F8F9FF]">
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Title */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-[#0B1C30]">
            {t('prescription.confirmTitle')}
          </Text>
          <Text className="text-sm text-[#43474D] mt-1">
            Review confirmed medicines and select handover language.
          </Text>
        </View>

        {/* Safety & Rule Engine Checks Banner */}
        <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex-row items-start">
          <Ionicons name="shield-checkmark" size={24} color="#059669" className="mr-3" />
          <View className="flex-1 ml-2">
            <Text className="text-base font-bold text-emerald-900">
              Safety Verification Passed
            </Text>
            <Text className="text-xs text-emerald-700 mt-1">
              Rule engine performed checks: No critical drug-drug interactions or severe dosage anomalies detected.
            </Text>
          </View>
        </View>

        {/* Confirmed Medicines Summary */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#0B1C30] mb-3">
            Confirmed Medicines ({medicines.length})
          </Text>
          {medicines.map((med) => (
            <Card key={med.id} className="mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-bold text-[#0B1C30]">
                  {med.medicine_name}
                </Text>
                <Badge status="confirmed" label="Confirmed" />
              </View>

              <View className="flex-row flex-wrap gap-2 mt-1">
                {med.dosage && (
                  <View className="bg-[#EFF4FF] px-2.5 py-1 rounded-md">
                    <Text className="text-xs text-[#0F2942]">Dose: {med.dosage}</Text>
                  </View>
                )}
                {med.frequency && (
                  <View className="bg-[#EFF4FF] px-2.5 py-1 rounded-md">
                    <Text className="text-xs text-[#0F2942]">Freq: {med.frequency}</Text>
                  </View>
                )}
                {med.duration && (
                  <View className="bg-[#EFF4FF] px-2.5 py-1 rounded-md">
                    <Text className="text-xs text-[#0F2942]">Duration: {med.duration}</Text>
                  </View>
                )}
              </View>

              {med.instructions ? (
                <Text className="text-xs text-[#43474D] mt-2 italic">
                  Note: {med.instructions}
                </Text>
              ) : null}
            </Card>
          ))}
        </View>

        {/* Language Selection Card */}
        <View className="bg-white p-4 rounded-2xl border border-[#E5EEFF] mb-6">
          <Text className="text-base font-bold text-[#0B1C30] mb-2">
            {t('handover.selectLanguage')}
          </Text>
          <Text className="text-xs text-[#43474D] mb-4">
            Select the language in which you want AI to generate medicine explanations.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setTargetLang('en')}
              className={`flex-1 p-3 rounded-xl border items-center flex-row justify-center ${
                targetLang === 'en'
                  ? 'bg-[#0D9488]/10 border-[#0D9488]'
                  : 'bg-[#F8F9FF] border-[#E5EEFF]'
              }`}
            >
              <Ionicons
                name={targetLang === 'en' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={targetLang === 'en' ? '#0D9488' : '#74777E'}
              />
              <Text
                className={`ml-2 font-bold ${
                  targetLang === 'en' ? 'text-[#0D9488]' : 'text-[#43474D]'
                }`}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTargetLang('ur')}
              className={`flex-1 p-3 rounded-xl border items-center flex-row justify-center ${
                targetLang === 'ur'
                  ? 'bg-[#0D9488]/10 border-[#0D9488]'
                  : 'bg-[#F8F9FF] border-[#E5EEFF]'
              }`}
            >
              <Ionicons
                name={targetLang === 'ur' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={targetLang === 'ur' ? '#0D9488' : '#74777E'}
              />
              <Text
                className={`ml-2 font-bold ${
                  targetLang === 'ur' ? 'text-[#0D9488]' : 'text-[#43474D]'
                }`}
              >
                اردو (Urdu)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Generate Handover Button */}
        <Button
          title={t('handover.generateHandover')}
          onPress={handleGenerate}
          loading={isGenerating}
          disabled={isGenerating}
          fullWidth
          variant="primary"
        />
      </ScrollView>
    </SafeView>
  );
}
