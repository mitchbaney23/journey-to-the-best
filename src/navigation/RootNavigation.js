import { Slot } from 'expo-router'; // Import Slot from expo-router
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth } from '../config/firebaseConfig';

import LoginScreen from '../screens/LoginScreen';

const RootNavigation = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // If a user is logged in, Slot will render the current route (our tab layout).
  // If not, it renders the LoginScreen.
  return user ? <Slot /> : <LoginScreen />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    }
})

export default RootNavigation;
// This code sets up the root navigation for the app.
// It listens for authentication state changes and conditionally renders either the main app content (via Slot) or the LoginScreen.
// The Slot component from expo-router allows for dynamic routing based on the current route.
// The app shows a loading indicator while checking the authentication state.   
