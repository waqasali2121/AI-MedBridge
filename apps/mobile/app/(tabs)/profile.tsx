import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeView } from '@/components/layout/SafeView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      'Are you sure you want to log out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeView className="bg-[#F8F9FF]">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-[#0F2942] mb-4">
          {t('profile.title')}
        </Text>

        {/* User Card */}
        <Card className="p-4 bg-white rounded-2xl border border-[#E5EEFF] mb-4 flex-row items-center space-x-4">
          <View className="w-14 h-14 rounded-full bg-[#0D9488] items-center justify-center">
            <Text className="text-xl font-bold text-white uppercase">
              {user?.full_name ? user.full_name.substring(0, 2) : 'P'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-[#0B1C30]">
              {user?.full_name || 'Patient'}
            </Text>
            <Text className="text-xs text-[#43474D] mt-0.5">
              {user?.email || 'patient@example.com'}
            </Text>
            <View className="mt-2 self-start bg-[#EFF4FF] px-2.5 py-0.5 rounded-full border border-[#DCE9FF]">
              <Text className="text-[10px] font-semibold text-[#0D9488] capitalize">
                {user?.role || 'Patient'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Language Selection */}
        <Text className="text-sm font-semibold text-[#0B1C30] mb-2">
          {t('profile.language')}
        </Text>
        <Card className="p-4 bg-white rounded-2xl border border-[#E5EEFF] mb-4">
          <Text className="text-xs text-[#43474D] mb-3">
            Select preferred language for medication explanations and UI:
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              className={`flex-1 p-3 rounded-xl border flex-row items-center justify-between ${
                language === 'en'
                  ? 'bg-[#0D9488]/10 border-[#0D9488]'
                  : 'bg-white border-[#C3C6CE]'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  language === 'en' ? 'text-[#0D9488]' : 'text-[#43474D]'
                }`}
              >
                English
              </Text>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={20} color="#0D9488" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLanguage('ur')}
              className={`flex-1 p-3 rounded-xl border flex-row items-center justify-between ${
                language === 'ur'
                  ? 'bg-[#0D9488]/10 border-[#0D9488]'
                  : 'bg-white border-[#C3C6CE]'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  language === 'ur' ? 'text-[#0D9488]' : 'text-[#43474D]'
                }`}
              >
                اردو (Urdu)
              </Text>
              {language === 'ur' && (
                <Ionicons name="checkmark-circle" size={20} color="#0D9488" />
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* About MedBridge */}
        <Text className="text-sm font-semibold text-[#0B1C30] mb-2">
          {t('profile.aboutMedBridge')}
        </Text>
        <Card className="p-4 bg-white rounded-2xl border border-[#E5EEFF] mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-semibold text-[#0B1C30]">
              {t('common.appName')} Mobile App
            </Text>
            <Text className="text-xs text-[#74777E]">
              {t('profile.appVersion')}: 1.0.0
            </Text>
          </View>
          <Text className="text-xs text-[#43474D] leading-5">
            MedBridge is an AI-assisted medicine handover app designed for patients in Pakistan to bridge the gap between doctor prescriptions and safe medicine usage.
          </Text>
        </Card>

        {/* Safety Disclaimer */}
        <Card className="p-4 bg-amber-50 border border-amber-200 mb-6 rounded-2xl">
          <View className="flex-row items-start space-x-2">
            <Ionicons name="shield-checkmark-outline" size={20} color="#B45309" />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-amber-900 mb-1">
                {t('profile.safetyDisclaimer')}
              </Text>
              <Text className="text-[11px] text-amber-800 leading-4">
                {t('profile.disclaimerText')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title={t('profile.logout')}
          onPress={handleLogout}
          variant="destructive"
          fullWidth
          icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
        />
      </ScrollView>
    </SafeView>
  );
}
