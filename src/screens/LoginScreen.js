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

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        level: 1,
        xp: 0,
        armor: 'Leather Tunic',
        weapon: 'Wooden Sword',
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

// This code defines a LoginScreen component that allows users to log in or sign up using Firebase Authentication.
// It includes input fields for email and password, and buttons for login and sign up.
// When a user signs up, it creates a new user in Firebase Auth and also creates a corresponding user document in Firestore with default values for level, xp, armor, and weapon.
// If there are any errors during login or sign up, they are displayed below the input fields.
// The styles   are defined to give the screen a dark theme with white text and buttons.
// The component uses SafeAreaView to ensure proper layout on devices with notches or rounded corners