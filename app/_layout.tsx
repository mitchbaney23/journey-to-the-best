import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth'; // Using relative path for robustness

const InitialLayout: React.FC = () => {
    const { user, initializing }: { user: any; initializing: boolean } = useAuth();
    const router = useRouter();
    const segments: string[] = useSegments() as string[];

    useEffect(() => {
        if (initializing) return;

        const inAuthGroup = typeof segments[0] === 'string' && segments[0].startsWith('auth');

        // If the user is signed in and the initial segment is not '(tabs)',
        // redirect them to the main tabs screen.
        if (user && segments[0] !== '(tabs)') {
            router.replace('/(tabs)');
        } 
        // If the user is not signed in and not in the auth group,
        // redirect them to the login page.
        else if (!user && !inAuthGroup) {
            router.replace('/login');
        }
    }, [user, initializing, segments]);

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Slot />;
};

export default InitialLayout;