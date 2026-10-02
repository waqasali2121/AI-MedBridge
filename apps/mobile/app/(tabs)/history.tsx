import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate } from '@/utils/formatting';
import { Prescription } from '@/services/api';

export default function HistoryScreen() {
  const { t } = useLanguage();
  const { prescriptions, isLoading, fetchPrescriptions } = usePrescriptionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPrescriptions();
    setRefreshing(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
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

  const handlePressItem = (item: Prescription) => {
    const status = item.status?.toUpperCase();
    if (status === 'APPROVED' || status === 'CONFIRMED') {
      router.push(`/prescription/${item.id}/handover`);
    } else {
      router.push(`/prescription/${item.id}/review`);
    }
  };

  const renderItem = ({ item }: { item: Prescription }) => (
    <TouchableOpacity
      onPress={() => handlePressItem(item)}
      activeOpacity={0.7}
      className="mb-3"
    >
      <Card className="p-4 bg-white rounded-2xl border border-[#E5EEFF] shadow-sm flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3 flex-1">
          <View className="w-12 h-12 rounded-2xl bg-[#EFF4FF] items-center justify-center">
            <Ionicons name="document-text" size={24} color="#0D9488" />
          </View>

          <View className="flex-1 pr-2">
            <Text className="text-sm font-semibold text-[#0B1C30]" numberOfLines={1}>
              {item.file_name || `Prescription #${item.id}`}
            </Text>
            <Text className="text-xs text-[#43474D] mt-1">
              {formatDate(item.created_at)}
            </Text>
            <Text className="text-xs text-[#74777E] mt-0.5">
              {item.medicine_count || 0} medicines extracted
            </Text>
          </View>
        </View>

        <View className="items-end justify-between h-12">
          <Badge status={getStatusVariant(item.status)} label={item.status} />
          <Ionicons name="chevron-forward" size={18} color="#74777E" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeView className="bg-[#F8F9FF]">
      <View className="p-4 flex-1">
        <Text className="text-xl font-bold text-[#0F2942] mb-1">
          {t('home.prescriptionHistory')}
        </Text>
        <Text className="text-sm text-[#43474D] mb-4">
          All your uploaded prescriptions and medicine handovers.
        </Text>

        {isLoading && prescriptions.length === 0 ? (
          <LoadingSpinner message={t('common.loading')} />
        ) : (
          <FlatList
            data={prescriptions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D9488']} />
            }
            ListEmptyComponent={
              <Card className="items-center justify-center p-8 bg-white rounded-2xl border border-[#E5EEFF]">
                <Ionicons name="time-outline" size={56} color="#C3C6CE" />
                <Text className="text-base font-semibold text-[#0B1C30] mt-4">
                  No Prescriptions Yet
                </Text>
                <Text className="text-xs text-[#43474D] mt-1 text-center">
                  Uploaded prescriptions will appear here.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/upload')}
                  className="mt-4 bg-[#0D9488] px-5 py-2.5 rounded-xl shadow-sm"
                >
                  <Text className="text-xs font-semibold text-white">
                    {t('home.uploadPrescription')}
                  </Text>
                </TouchableOpacity>
              </Card>
            }
          />
        )}
      </View>
    </SafeView>
  );
}
