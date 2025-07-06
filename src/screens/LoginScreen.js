import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
// Import db and firestore functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (email === '' || password === '') {
      setError("Please enter both email and password.");
      return;
    }
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore with just the email
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
      });

    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError("Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  // ... rest of the component is the same
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Journey to the Best</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="#4CAF50" />
          <Button title="Sign Up" onPress={handleSignUp} color="#2196F3" />
        </View>
      </View>
    </SafeAreaView>
  );
};

// ... styles are the same
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default LoginScreen;
// This code defines a LoginScreen component that allows users to log in or sign up.
// It uses Firebase Authentication to handle user accounts and Firestore to store user data.
// The component includes input fields for email and password, and buttons for login and sign-up.
// It also handles errors and displays them to the user. The styles are defined using StyleSheet from React Native.
// The SafeAreaView ensures that the content is displayed within the safe area boundaries of the device, providing a better user experience on devices with notches or rounded corners.
// The component is exported for use in other parts of the application, such as the RootNavigation component, which determines whether to show the LoginScreen or HomeScreen based on the user's authentication state.
// This code is a complete implementation of a login screen for a React Native application using Firebase for authentication and Firestore for user data storage.
// It provides a user-friendly interface for logging in and signing up, with error handling for invalid inputs.
// The styles are designed to create a visually appealing and functional layout, ensuring a good user experience across different devices.
// The component is ready to be integrated into the larger application, allowing users to authenticate and access their profiles securely.
// The use of SafeAreaView ensures that the content is displayed correctly on devices with notches or rounded corners, enhancing the overall user experience