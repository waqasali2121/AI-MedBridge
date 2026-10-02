import React from 'react';
import { Stack } from 'expo-router';

export default function PrescriptionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: '#0D9488',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: 'bold', color: '#0B1C30' },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="[id]/review"
        options={{ title: 'Review Medicines' }}
      />
      <Stack.Screen
        name="[id]/confirm"
        options={{ title: 'Confirm Prescription' }}
      />
      <Stack.Screen
        name="[id]/handover"
        options={{ title: 'AI Handover' }}
      />
      <Stack.Screen
        name="[id]/card"
        options={{ title: 'Handover Card' }}
      />
    </Stack>
  );
}
