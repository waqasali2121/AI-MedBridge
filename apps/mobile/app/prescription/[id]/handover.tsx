import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { prescriptionsAPI, HandoverContent } from '@/services/api';
import { useLanguage } from '@/hooks/useLanguage';

export default function PrescriptionHandoverScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prescriptionId = Number(id);
  const { t, language, setLanguage } = useLanguage();

  const [handoverData, setHandoverData] = useState<HandoverContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHandover = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await prescriptionsAPI.getHandover(prescriptionId);
      setHandoverData(res.data);
    } catch (err: any) {
      // If handover not generated yet, try to trigger generation
      try {
        await prescriptionsAPI.setLanguage(prescriptionId, language);
        await prescriptionsAPI.generate(prescriptionId);
        const retryRes = await prescriptionsAPI.getHandover(prescriptionId);
        setHandoverData(retryRes.data);
      } catch (retryErr: any) {
        setError(retryErr.message || 'Failed to fetch handover content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (prescriptionId) {
      loadHandover();
    }
  }, [prescriptionId, language]);

  if (isLoading) {
    return (
      <SafeView className="flex-1 bg-[#F8F9FF]">
        <LoadingSpinner fullScreen message="Generating AI Handover..." />
      </SafeView>
    );
  }

  if (error || !handoverData) {
    return (
      <SafeView className="flex-1 bg-[#F8F9FF] justify-center items-center p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#BA1A1A" />
        <Text className="text-xl font-bold text-[#0B1C30] mt-4 text-center">
          Handover Unavailable
        </Text>
        <Text className="text-sm text-[#43474D] mt-2 text-center mb-6">
          {error || 'Unable to load handover instructions at this time.'}
        </Text>
        <Button title={t('common.retry')} onPress={loadHandover} variant="primary" />
      </SafeView>
    );
  }

  const isUrdu = language === 'ur';
  const content = handoverData.content as any || {};

  return (
    <SafeView className="flex-1 bg-[#F8F9FF]">
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Top Header & Language Switcher */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold text-[#0B1C30]">
              {t('handover.title')}
            </Text>
            <Text className="text-xs text-[#43474D]">
              Prescription #{prescriptionId}
            </Text>
          </View>

          {/* EN/UR Switch */}
          <View className="flex-row bg-[#E5EEFF] rounded-full p-1 border border-[#DCE9FF]">
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-full ${
                language === 'en' ? 'bg-[#0D9488]' : 'bg-transparent'
              }`}
            >
              <Text className={`text-xs font-bold ${language === 'en' ? 'text-white' : 'text-[#43474D]'}`}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage('ur')}
              className={`px-3 py-1.5 rounded-full ${
                language === 'ur' ? 'bg-[#0D9488]' : 'bg-transparent'
              }`}
            >
              <Text className={`text-xs font-bold ${language === 'ur' ? 'text-white' : 'text-[#43474D]'}`}>
                اردو
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Review Status Card (Orange / Amber Container) */}
        <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Ionicons name="time-outline" size={24} color="#B45309" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-amber-900">
                {t('handover.reviewStatus')}
              </Text>
              <Text className="text-xs text-amber-700 mt-0.5">
                {content.review_status || 'Pending Pharmacist Review'}
              </Text>
            </View>
          </View>
          <Badge status="pending" label={t('handover.pending')} />
        </View>

        {/* 2. Prescription Info Card (Navy Header / Blue Container) */}
        <View className="bg-[#0F2942] rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#86F2E4" />
            <Text className="text-base font-bold text-white ml-2">
              Prescription Summary
            </Text>
          </View>
          <Text className="text-xs text-[#E5EEFF] leading-5">
            {content.summary || content.overview || 'This handover provides clear guidelines on your prescribed regimen, timings, precautions, and questions for your pharmacist.'}
          </Text>
        </View>

        {/* 3. AI Explanation & Schedule Card (Teal/Green Container) */}
        <View className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb-outline" size={22} color="#0D9488" />
            <Text className={`text-lg font-bold text-[#0F766E] ml-2 ${isUrdu ? 'text-right' : ''}`}>
              {t('handover.explanationTitle')}
            </Text>
          </View>

          {/* Schedule List */}
          {Array.isArray(content.medicines || content.schedule) ? (
            (content.medicines || content.schedule).map((med: any, index: number) => (
              <View key={index} className="bg-white p-3.5 rounded-xl mb-3 border border-teal-100 shadow-sm">
                <Text className="text-base font-bold text-[#0B1C30] mb-1">
                  {med.name || med.medicine_name}
                </Text>
                <Text className="text-xs text-[#0F766E] font-medium mb-2">
                  {t('handover.medicineSchedule')}: {med.schedule || med.timing || med.frequency}
                </Text>

                {med.explanation && (
                  <Text className={`text-xs text-[#43474D] bg-[#F8F9FF] p-2.5 rounded-lg border border-[#E5EEFF] ${isUrdu ? 'text-right' : ''}`}>
                    {med.explanation}
                  </Text>
                )}

                {med.instructions && (
                  <Text className="text-xs text-[#0F2942] mt-2 italic">
                    Instructions: {med.instructions}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text className="text-sm text-[#0B1C30]">
              {content.explanation || JSON.stringify(content)}
            </Text>
          )}
        </View>

        {/* 4. Questions for Pharmacist Section */}
        <View className="bg-white border border-[#E5EEFF] rounded-2xl p-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="help-circle-outline" size={22} color="#0D9488" />
            <Text className="text-base font-bold text-[#0B1C30] ml-2">
              {t('handover.questionsForPharmacist')}
            </Text>
          </View>

          {Array.isArray(content.questions_for_pharmacist) && content.questions_for_pharmacist.length > 0 ? (
            content.questions_for_pharmacist.map((q: string, idx: number) => (
              <View key={idx} className="flex-row items-start mb-2">
                <Text className="text-teal-600 font-bold mr-2">•</Text>
                <Text className={`text-xs text-[#43474D] flex-1 ${isUrdu ? 'text-right' : ''}`}>
                  {q}
                </Text>
              </View>
            ))
          ) : (
            <View>
              <Text className="text-xs text-[#43474D] mb-1">• Is it best to take these medications before or after meals?</Text>
              <Text className="text-xs text-[#43474D] mb-1">• What should I do if I miss a scheduled dose?</Text>
              <Text className="text-xs text-[#43474D]">• Are there any specific foods or medicines I must avoid?</Text>
            </View>
          )}
        </View>

        {/* Navigation to Card */}
        <Button
          title="View Final Handover Card"
          onPress={() => router.push(`/prescription/${prescriptionId}/card`)}
          fullWidth
          variant="primary"
          icon={<Ionicons name="card-outline" size={20} color="#FFFFFF" />}
        />
      </ScrollView>
    </SafeView>
  );
}
