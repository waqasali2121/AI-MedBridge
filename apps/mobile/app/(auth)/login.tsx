import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { SafeView } from "@/components/layout/SafeView";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) return;
    clearError();
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      // Error handled by store
    }
  };

  return (
    <SafeView className="flex-1 bg-[#F8F9FF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 justify-between py-8">
          <View className="flex-1 justify-center">
            {/* Logo Section */}
            <View className="items-center mb-8">
              <View className="flex-row items-center mb-2">
                <Text className="text-4xl font-bold text-[#0F2942]">Med</Text>
                <Text className="text-4xl font-bold text-[#0D9488]">Bridge</Text>
              </View>
              <Text className="text-sm font-medium text-[#43474D]">
                Medication Handover Assistant
              </Text>
            </View>

            {/* Error Display */}
            {error && (
              <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <Text className="text-sm text-red-700 text-center">{error}</Text>
              </View>
            )}

            {/* Form Section */}
            <View className="space-y-4 mb-6">
              <Input
                label={t("auth.email")}
                value={email}
                onChangeText={setEmail}
                placeholder={t("auth.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
              />

              <Input
                label={t("auth.password")}
                value={password}
                onChangeText={setPassword}
                placeholder={t("auth.passwordPlaceholder")}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />
            </View>

            {/* Submit Button */}
            <Button
              title={t("auth.loginButton")}
              onPress={handleLogin}
              loading={isLoading}
              disabled={!email || !password || isLoading}
              fullWidth
              variant="primary"
            />

            {/* Register Link */}
            <TouchableOpacity
              onPress={() => {
                clearError();
                router.push("/(auth)/register");
              }}
              className="mt-6 py-2 items-center"
            >
              <Text className="text-sm text-[#0D9488] font-semibold">
                {t("auth.noAccount")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Language Toggle at bottom */}
          <View className="items-center pt-4 border-t border-[#E5EEFF]">
            <TouchableOpacity
              onPress={toggleLanguage}
              className="px-4 py-2 bg-[#E5EEFF] rounded-full flex-row items-center space-x-2"
            >
              <Text className="text-xs font-semibold text-[#0B1C30]">
                {language === "en" ? "اردو میں تبدیل کریں" : "Switch to English"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
