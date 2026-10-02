import React, { useEffect } from 'react';
import { View, Text, ScrollView, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate } from '@/utils/formatting';

export default function PrescriptionCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prescriptionId = Number(id);
  const { t } = useLanguage();

  const {
    currentPrescription,
    medicines,
    isLoading,
    fetchPrescription,
    fetchMedicines,
  } = usePrescriptionStore();

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription(prescriptionId);
      fetchMedicines(prescriptionId);
    }
  }, [prescriptionId]);

  const handleShare = async () => {
    try {
      const medicineSummary = medicines
        .map((m) => `- ${m.medicine_name} (${m.dosage || 'N/A'}): ${m.frequency || ''} ${m.instructions || ''}`)
        .join('\n');

      const message = `MedBridge Handover Card\nPrescription #${prescriptionId}\nDate: ${
        currentPrescription ? formatDate(currentPrescription.created_at) : ''
      }\n\nMedicines:\n${medicineSummary}\n\nVerified via MedBridge App.`;

      await Share.share({
        title: `MedBridge Handover #${prescriptionId}`,
        message,
      });
    } catch (error: any) {
      console.error('Error sharing handover card:', error.message);
    }
  };

  if (isLoading && !currentPrescription) {
    return (
      <SafeView className="flex-1 bg-[#F8F9FF]">
        <LoadingSpinner fullScreen message="Loading Handover Card..." />
      </SafeView>
    );
  }

  return (
    <SafeView className="flex-1 bg-[#F8F9FF]">
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Main Digital Handover Card */}
        <View className="bg-white rounded-3xl border border-[#E5EEFF] shadow-md overflow-hidden mb-6">
          {/* Card Header Banner */}
          <View className="bg-[#0F2942] p-5 flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-white">Med</Text>
                <Text className="text-xl font-bold text-[#14B8A6]">Bridge</Text>
              </View>
              <Text className="text-xs text-[#86F2E4] font-medium mt-0.5">
                Patient Medicine Handover Card
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-white">
                #{prescriptionId}
              </Text>
              <Text className="text-[10px] text-[#C3C6CE] mt-0.5">
                {currentPrescription ? formatDate(currentPrescription.created_at) : ''}
              </Text>
            </View>
          </View>

          {/* Verification Status Banner */}
          <View className="bg-teal-50 border-b border-teal-100 p-3 flex-row items-center justify-between px-5">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#0D9488" />
              <Text className="text-xs font-bold text-[#0F766E] ml-2">
                Handover Verification Status
              </Text>
            </View>
            <Badge status="verified" label="Digital Handover" />
          </View>

          {/* Medicines Schedule Body */}
          <View className="p-5">
            <Text className="text-xs font-bold text-[#74777E] uppercase tracking-wider mb-3">
              Prescribed Regimen & Timing
            </Text>

            {medicines.map((med, index) => (
              <View
                key={med.id}
                className={`py-3.5 ${
                  index !== medicines.length - 1 ? 'border-b border-[#EFF4FF]' : ''
                }`}
              >
                <View className="flex-row justify-between items-start mb-1.5">
                  <Text className="text-base font-bold text-[#0B1C30] flex-1">
                    {med.medicine_name}
                  </Text>
                  {med.dosage && (
                    <Text className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2 py-0.5 rounded">
                      {med.dosage}
                    </Text>
                  )}
                </View>

                {/* Timing Icons Row */}
                <View className="flex-row items-center gap-3 my-1.5">
                  <View className="flex-row items-center bg-[#EFF4FF] px-2 py-1 rounded-md">
                    <Ionicons name="sunny-outline" size={14} color="#006A61" />
                    <Text className="text-[11px] text-[#0B1C30] ml-1 font-medium">
                      {med.frequency || 'Daily'}
                    </Text>
                  </View>
                  {med.duration && (
                    <View className="flex-row items-center bg-[#EFF4FF] px-2 py-1 rounded-md">
                      <Ionicons name="calendar-outline" size={14} color="#006A61" />
                      <Text className="text-[11px] text-[#0B1C30] ml-1 font-medium">
                        {med.duration}
                      </Text>
                    </View>
                  )}
                </View>

                {med.instructions ? (
                  <Text className="text-xs text-[#43474D] mt-1 italic bg-[#F8F9FF] p-2 rounded-lg">
                    Instructions: {med.instructions}
                  </Text>
                ) : null}
              </View>
            ))}

            {/* Special Precautions */}
            <View className="bg-[#EFF4FF] rounded-xl p-3.5 mt-4">
              <View className="flex-row items-center mb-1">
                <Ionicons name="alert-circle" size={16} color="#0F2942" />
                <Text className="text-xs font-bold text-[#0F2942] ml-1.5">
                  Handover Safety Reminder
                </Text>
              </View>
              <Text className="text-[11px] text-[#43474D] leading-4">
                Always confirm instructions with your pharmacist. Do not modify dosages without consulting your doctor.
              </Text>
            </View>
          </View>

          {/* Pharmacist Stamp Footer Placeholder */}
          <View className="bg-[#F8F9FF] p-4 border-t border-[#E5EEFF] flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="ribbon-outline" size={20} color="#0D9488" />
              <Text className="text-xs text-[#0B1C30] font-medium ml-2">
                MedBridge AI Verification Engine
              </Text>
            </View>
            <Text className="text-[10px] text-[#74777E]">Powered by MedBridge</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button
            title="Share Handover Card"
            onPress={handleShare}
            fullWidth
            variant="primary"
            icon={<Ionicons name="share-social-outline" size={20} color="#FFFFFF" />}
          />
          <Button
            title="Back to Home"
            onPress={() => router.replace('/(tabs)')}
            fullWidth
            variant="outline"
            icon={<Ionicons name="home-outline" size={20} color="#0D9488" />}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
}
