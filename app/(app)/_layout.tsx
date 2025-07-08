import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

const MainLayout = () => {
    const { user, initializing } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (initializing) return;

        const inTabsGroup = segments[0] === '(tabs)';

        if (user && !inTabsGroup) {
            router.replace('/(tabs)');
        } else if (!user) {
            router.replace('/(auth)/login');
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

export default MainLayout;
