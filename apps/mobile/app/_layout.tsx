import "../global.css";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function RootLayout() {
  const loadUser = useAuthStore((state) => state.loadUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading MedBridge..." />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
