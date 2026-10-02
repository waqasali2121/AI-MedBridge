import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { SafeView } from "@/components/layout/SafeView";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "caregiver">("patient");
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();

  const handleRegister = async () => {
    if (!fullName || !email || !password) return;
    clearError();
    try {
      await register({
        full_name: fullName,
        email,
        password,
        role,
      });
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
            {/* Header Section */}
            <View className="items-center mb-6">
              <Text className="text-3xl font-bold text-[#0B1C30] mb-1">
                {t("auth.register")}
              </Text>
              <Text className="text-sm font-medium text-[#43474D]">
                Join MedBridge to manage your medication handovers
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
                label={t("auth.name")}
                value={fullName}
                onChangeText={setFullName}
                placeholder={t("auth.namePlaceholder")}
                leftIcon="person-outline"
              />

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

              {/* Role Segmented Control */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-[#0B1C30] mb-2">
                  {t("auth.role")}
                </Text>
                <View className="flex-row bg-[#E5EEFF] p-1 rounded-xl">
                  <TouchableOpacity
                    onPress={() => setRole("patient")}
                    className={`flex-1 py-2.5 items-center rounded-lg ${
                      role === "patient" ? "bg-[#0D9488]" : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        role === "patient" ? "text-white" : "text-[#43474D]"
                      }`}
                    >
                      {t("auth.patient")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRole("caregiver")}
                    className={`flex-1 py-2.5 items-center rounded-lg ${
                      role === "caregiver" ? "bg-[#0D9488]" : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        role === "caregiver" ? "text-white" : "text-[#43474D]"
                      }`}
                    >
                      {t("auth.caregiver")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Register Button */}
            <Button
              title={t("auth.registerButton")}
              onPress={handleRegister}
              loading={isLoading}
              disabled={!fullName || !email || !password || isLoading}
              fullWidth
              variant="primary"
            />

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => {
                clearError();
                router.push("/(auth)/login");
              }}
              className="mt-6 py-2 items-center"
            >
              <Text className="text-sm text-[#0D9488] font-semibold">
                {t("auth.hasAccount")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
