import { useFonts } from 'expo-font'; // <-- Import useFonts
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth'; // <-- Corrected relative path

const InitialLayout = () => {
    const { user, initializing: authInitializing } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    
    // Load custom fonts
    const [fontsLoaded, fontError] = useFonts({
        'Cinzel': require('../assets/fonts/Cinzel-Regular.ttf'), // Adjust filename if needed
        'Lora': require('../assets/fonts/Lora-Regular.ttf'),   // Adjust filename if needed
    });

    useEffect(() => {
        if (!fontsLoaded && !fontError) {
            return; // Wait for fonts to load or fail
        }

        if (authInitializing) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (user && !inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
    }, [user, authInitializing, fontsLoaded, fontError, segments]);

    // Show a loading indicator while fonts or auth state are loading
    if (!fontsLoaded || authInitializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
                <ActivityIndicator size="large" color="#FFFFFF"/>
            </View>
        );
    }

    return <Slot />;
};

export default InitialLayout;
