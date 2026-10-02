import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { formatDate } from '@/utils/formatting';

export default function HomeScreen() {
  const { user } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { prescriptions, isLoading, fetchPrescriptions } = usePrescriptionStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPrescriptions();
    setRefreshing(false);
  };

  const recentPrescriptions = prescriptions.slice(0, 3);

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'CONFIRMED':
        return 'approved';
      case 'EXTRACTED':
        return 'extracted';
      case 'PROCESSING':
        return 'processing';
      case 'CORRECTION_REQUIRED':
        return 'error';
      default:
        return 'pending';
    }
  };

  const handleCardPress = (id: number, status: string) => {
    if (status.toUpperCase() === 'APPROVED' || status.toUpperCase() === 'CONFIRMED') {
      router.push(`/prescription/${id}/handover`);
    } else {
      router.push(`/prescription/${id}/review`);
    }
  };

  return (
    <SafeView className="bg-[#F8F9FF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D9488']} />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="flex-row items-center space-x-1">
              <Text className="text-2xl font-bold text-[#0F2942]">Med</Text>
              <Text className="text-2xl font-bold text-[#0D9488]">Bridge</Text>
            </View>
            <Text className="text-sm text-[#43474D] mt-0.5">
              {t('home.welcome')}, {user?.full_name || 'Patient'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleLanguage}
            className="bg-[#E5EEFF] px-3 py-1.5 rounded-full border border-[#0D9488]/30 flex-row items-center space-x-1"
          >
            <Ionicons name="globe-outline" size={16} color="#0D9488" />
            <Text className="text-xs font-semibold text-[#0D9488] uppercase">
              {language === 'en' ? 'اردو' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Safety Notice Card */}
        <Card className="bg-amber-50 border border-amber-200 mb-6 p-4 rounded-2xl">
          <View className="flex-row items-start space-x-3">
            <Ionicons name="information-circle" size={24} color="#D97706" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-amber-900 mb-1">
                {t('home.safetyNotice')}
              </Text>
              <Text className="text-xs text-amber-800 leading-4">
                {t('home.safetyNoticeText')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text className="text-base font-semibold text-[#0B1C30] mb-3">
          {t('home.quickActions')}
        </Text>
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/upload')}
            className="flex-1 bg-[#0D9488] p-4 rounded-2xl shadow-sm flex-row items-center justify-between"
          >
            <View>
              <Ionicons name="cloud-upload" size={28} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm mt-2">
                {t('home.uploadPrescription')}
              </Text>
              <Text className="text-teal-100 text-xs mt-0.5">Scan & Analyze</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/history')}
            className="flex-1 bg-[#0F2942] p-4 rounded-2xl shadow-sm flex-row items-center justify-between"
          >
            <View>
              <Ionicons name="time" size={28} color="#86F2E4" />
              <Text className="text-white font-semibold text-sm mt-2">
                {t('home.prescriptionHistory')}
              </Text>
              <Text className="text-blue-200 text-xs mt-0.5">View Saved</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Recent Prescriptions */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-semibold text-[#0B1C30]">
            {t('home.recentPrescriptions')}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text className="text-xs font-semibold text-[#0D9488]">
              {t('home.viewAll')}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && recentPrescriptions.length === 0 ? (
          <LoadingSpinner message={t('common.loading')} />
        ) : recentPrescriptions.length === 0 ? (
          <Card className="items-center justify-center p-8 bg-white rounded-2xl border border-[#E5EEFF]">
            <Ionicons name="document-text-outline" size={48} color="#C3C6CE" />
            <Text className="text-sm font-medium text-[#43474D] mt-3 text-center">
              {t('home.noRecentPrescriptions')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/upload')}
              className="mt-4 bg-[#0D9488]/10 px-4 py-2 rounded-xl border border-[#0D9488]/30"
            >
              <Text className="text-xs font-semibold text-[#0D9488]">
                {t('home.uploadPrescription')}
              </Text>
            </TouchableOpacity>
          </Card>
        ) : (
          recentPrescriptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleCardPress(item.id, item.status)}
              activeOpacity={0.7}
            >
              <Card className="mb-3 p-4 bg-white rounded-2xl border border-[#E5EEFF] shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center space-x-3 flex-1">
                  <View className="w-10 h-10 rounded-xl bg-[#EFF4FF] items-center justify-center">
                    <Ionicons name="document-text" size={20} color="#0D9488" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-[#0B1C30]" numberOfLines={1}>
                      {item.file_name || `Prescription #${item.id}`}
                    </Text>
                    <Text className="text-xs text-[#43474D] mt-0.5">
                      {formatDate(item.created_at)} • {item.medicine_count || 0} meds
                    </Text>
                  </View>
                </View>

                <View className="items-end space-y-1">
                  <Badge status={getStatusVariant(item.status)} label={item.status} />
                  <Ionicons name="chevron-forward" size={16} color="#74777E" />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeView>
  );
}
