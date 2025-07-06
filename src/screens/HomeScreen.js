import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Set up a real-time listener for the user's document
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });

      // Cleanup the listener when the component unmounts
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
        <Text style={styles.title}>🏆 Welcome to the Journey!</Text>
        {userProfile ? (
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Adventurer: {userProfile.email}</Text>
            <Text style={styles.statText}>Level: {userProfile.level}</Text>
            <Text style={styles.statText}>XP: {userProfile.xp}</Text>
            <Text style={styles.statText}>Armor: {userProfile.armor}</Text>
            <Text style={styles.statText}>Weapon: {userProfile.weapon}</Text>
          </View>
        ) : (
          <Text style={styles.statText}>No profile data found.</Text>
        )}
        <View style={styles.signOutButton}>
            <Button title="Sign Out" onPress={handleSignOut} color="#f44336" />
        </View>
      </View>
    </SafeAreaView>
  );
};

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
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
    marginBottom: 40,
  },
  statText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  signOutButton: {
    marginTop: 20,
  }
});

export default HomeScreen;
// This code defines a HomeScreen component that displays the user's profile information fetched from Firestore.
// It includes a sign-out button that allows the user to log out of the application.  