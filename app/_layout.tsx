import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

// This component handles the redirection logic
const InitialLayout = () => {
    const { user, initializing } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (initializing) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (user && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
    }, [user, initializing, segments]);

    return <Slot />;
}

// This is the main root layout
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Cinzel': require('../assets/fonts/Cinzel-Regular.ttf'),
    'Lora': require('../assets/fonts/Lora-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <AuthProvider>
          <InitialLayout />
      </AuthProvider>
  );
}
