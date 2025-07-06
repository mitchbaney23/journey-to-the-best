import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth } from '../config/firebaseConfig';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const RootNavigation = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // This listener checks for login/logout changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Show a loading screen while Firebase is initializing
  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // If the API key is still the placeholder, show an error.
  if (auth.config.apiKey === "YOUR_API_KEY") {
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Firebase is not configured!</Text>
            <Text style={styles.errorText}>Please update src/config/firebaseConfig.js</Text>
        </View>
    )
  }

  return user ? <HomeScreen /> : <LoginScreen />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    }
})

export default RootNavigation;
// This code defines the root navigation for the app, checking if a user is logged in and rendering either the HomeScreen or LoginScreen accordingly.
// It also handles Firebase authentication state changes and shows a loading indicator while Firebase is initializing.
// If the Firebase API key is not set, it displays an error message prompting the user to configure it correctly.