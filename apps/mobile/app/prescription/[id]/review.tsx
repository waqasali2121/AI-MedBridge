import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react_native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MedicineCard } from '@/components/prescription/MedicineCard';
import { ConfidenceWarning } from '@/components/prescription/ConfidenceWarning';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { useLanguage } from '@/hooks/useLanguage';
import { Medicine } from '@/services/api';

export default function PrescriptionReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prescriptionId = Number(id);
  const { t } = useLanguage();

  const {
    currentPrescription,
    medicines,
    isLoading,
    fetchPrescription,
    fetchMedicines,
    updateMedicine,
    confirmPrescription,
  } = usePrescriptionStore();

  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription(prescriptionId);
      fetchMedicines(prescriptionId);
    }
  }, [prescriptionId]);

  const handleUpdateMedicine = async (medicineId: number, data: Partial<Medicine>) => {
    try {
      await updateMedicine(prescriptionId, medicineId, data);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || 'Failed to update medicine');
    }
  };

  const handleConfirm = async () => {
    if (!isChecked) return;
    setIsSubmitting(true);
    try {
      await confirmPrescription(prescriptionId);
      router.push(`/prescription/${prescriptionId}/confirm`);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || 'Failed to confirm prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !currentPrescription) {
    return (
      <SafeView>
        <LoadingSpinner fullScreen message={t('common.loading')} />
      </SafeView>
    );
  }

  // Calculate lowest confidence score
  const lowestConfidence = medicines.length > 0
    ? Math.min(...medicines.map((m) => m.confidence_score))
    : 1.0;

  return (
    <SafeView className="flex-1 bg-[#F8F9FF]">
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Title */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-[#0B1C30]">
            {t('prescription.reviewTitle')}
          </Text>
          <Text className="text-sm text-[#43474D] mt-1">
            {t('prescription.reviewSubtitle')}
          </Text>
        </View>

        {/* Confidence Warning */}
        {lowestConfidence < 0.8 && (
          <ConfidenceWarning
            confidence={lowestConfidence}
            field="Prescription OCR"
            message={t('prescription.lowConfidenceWarning')}
          />
        )}

        {/* Medicine Cards */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#0B1C30] mb-3">
            {t('prescription.medicines')} ({medicines.length})
          </Text>
          {medicines.length === 0 ? (
            <View className="bg-white p-6 rounded-2xl items-center border border-[#E5EEFF]">
              <Ionicons name="document-text-outline" size={48} color="#74777E" />
              <Text className="text-base text-[#43474D] mt-2 text-center">
                No medicines extracted yet or processing still in progress.
              </Text>
            </View>
          ) : (
            medicines.map((med) => (
              <MedicineCard
                key={med.id}
                medicine={med}
                isEditable={true}
                onUpdate={(updatedData) => handleUpdateMedicine(med.id, updatedData)}
              />
            ))
          )}
        </View>

        {/* Verification Checkbox */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsChecked(!isChecked)}
          className="flex-row items-center bg-white p-4 rounded-xl border border-[#E5EEFF] mb-6"
        >
          <View
            className={`w-6 h-6 rounded-md items-center justify-center border mr-3 ${
              isChecked ? 'bg-[#0D9488] border-[#0D9488]' : 'border-[#74777E]'
            }`}
          >
            {isChecked && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </View>
          <Text className="text-sm text-[#0B1C30] flex-1 font-medium">
            {t('prescription.confirmCheckbox')}
          </Text>
        </TouchableOpacity>

        {/* Action Button */}
        <Button
          title={t('prescription.confirmReview')}
          onPress={handleConfirm}
          disabled={!isChecked || isSubmitting}
          loading={isSubmitting}
          fullWidth
          variant="primary"
        />
      </ScrollView>
    </SafeView>
  );
}
