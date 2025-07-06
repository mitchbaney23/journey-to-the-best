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
                <Text style={styles.statText}>Adventurer: {userProfile.email}</Text>
                <Text style={styles.statText}>Current Stage: {userProfile.currentStage?.stage || 'N/A'}</Text>
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
  statsContainer: { padding: 20, backgroundColor: '#333', borderRadius: 10, width: '100%', marginBottom: 40 },
  statText: { fontSize: 18, color: '#FFFFFF', marginBottom: 10 },
  signOutButton: { position: 'absolute', bottom: 40 },
});

export default HomeScreen;
// This code defines the HomeScreen component, which displays the user's profile information and allows them to sign out. It fetches the user's data from Firestore and shows their current stage and email. If the user hasn't started their journey, it provides a button to navigate to the Start Your Journey screen.
// The component also handles loading states and displays a loading indicator while fetching data. The styles are defined using StyleSheet from React Native, ensuring a consistent look and feel across the app. The sign  