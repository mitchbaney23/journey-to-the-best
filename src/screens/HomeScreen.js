import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

const HomeScreen = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth).catch(error => console.log('Error signing out: ', error));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {userProfile?.baseline ? (
          <>
            <Text style={styles.title}>🏆 {userProfile.currentStage?.title || 'Welcome Adventurer!'} 🏆</Text>
            <View style={styles.statsContainer}>
                <Text style={styles.statText}>Adventurer: {userProfile.username || userProfile.email}</Text>
                <Text style={styles.statText}>Current Stage: {userProfile.currentStage?.stage || 'N/A'}</Text>
            </View>
            <View style={styles.buttonRow}>
                <Button title="Log a Workout" onPress={() => router.push('/log-workout')} color="#4CAF50" />
                <Button title="Edit Profile" onPress={() => router.push('/profile')} color="#2196F3" />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Begin Your Journey</Text>
            <Text style={styles.subtitle}>Determine your starting point on the path to greatness.</Text>
            <Button title="Start Your Journey" onPress={() => router.push('/start-journey')} color="#2196F3" />
          </>
        )}
        <View style={styles.signOutButton}>
            <Button title="Sign Out" onPress={handleSignOut} color="#f44336" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  statsContainer: { padding: 20, backgroundColor: '#333', borderRadius: 10, width: '100%', marginBottom: 20 },
  statText: { fontSize: 18, color: '#FFFFFF', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
  signOutButton: { position: 'absolute', bottom: 40 },
});

export default HomeScreen;
// This code defines the HomeScreen component, which serves as the main screen of the app.