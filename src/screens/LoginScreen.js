import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // <-- Add username state
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between Login and Sign Up form

  const handleSignUp = async () => {
    if (email === '' || password === '' || username === '') {
      setError("Please fill out all fields.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add username to the user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username, // <-- Save the username
      });

    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError("Please enter email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Journey to the Best</Text>
        
        {isSignUp && ( // <-- Only show username field on Sign Up
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
        )}
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

        {isSignUp ? (
            <View style={styles.buttonContainer}>
                <Button title="Sign Up" onPress={handleSignUp} color="#2196F3" />
                <Button title="Back to Login" onPress={() => setIsSignUp(false)} />
            </View>
        ) : (
            <View style={styles.buttonContainer}>
                <Button title="Login" onPress={handleLogin} color="#4CAF50" />
                <Button title="Create Account" onPress={() => setIsSignUp(true)} />
            </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 40 },
  input: { width: '100%', height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', marginBottom: 15, fontSize: 16 },
  errorText: { color: 'red', marginBottom: 20, textAlign: 'center' },
  buttonContainer: { width: '100%', marginTop: 20 },
});

export default LoginScreen;
// This code defines the LoginScreen component, which allows users to log in or sign up for the app.
// It includes fields for email, password, and username (for sign up), and handles authentication