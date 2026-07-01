import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message'; // Global toast provider module

import { useColorScheme } from '@/hooks/use-color-scheme';

// Keep the splash screen visible while navigation mounts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the splash screen immediately once this root layout mounts safely
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Enters your sub-tab directory routing maps */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      
      {/* Device top status bar coloring configuration */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* 🚀 Mounted at absolute root to hover safely over all tabs and modal transitions! */}
      <Toast />
    </>
  );
} 