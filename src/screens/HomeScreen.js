import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

// The STAGES array defines the entire journey
const STAGES = [
    { stage: 1, title: "🌱 Awakened Seeker" },
    { stage: 2, title: "🍂 Pathfinder" },
    { stage: 3, title: "🌸 Disciple" },
    { stage: 4, title: "🪷 Enlightened Warrior" },
    { stage: 5, title: "🏔️ Mountain Sage" },
    { stage: 6, title: "🔥 Heavenly Champion" },
    { stage: 7, title: "👑 Monkey King Ascended" }
];

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

  const renderStageItem = ({ item }) => {
    const isCurrentStage = item.stage === userProfile?.currentStage?.stage;
    return (
        <View style={[styles.stageContainer, isCurrentStage && styles.currentStage]}>
            <Text style={styles.stageNumber}>{item.stage}</Text>
            <Text style={styles.stageTitle}>{item.title}</Text>
        </View>
    );
  };

  const ListHeader = () => (
    <>
        <Text style={styles.title}>Journey to the Best</Text>
        <View style={styles.statsContainer}>
            <Text style={styles.statText}>Adventurer: {userProfile.username || userProfile.email}</Text>
            <Text style={styles.statText}>Current Stage: {userProfile.currentStage?.title || 'N/A'}</Text>
        </View>
        <View style={styles.buttonRow}>
            <Button title="Log a Workout" onPress={() => router.push('/log-workout')} color="#4CAF50" />
            <Button title="Edit Profile" onPress={() => router.push('/profile')} color="#2196F3" />
        </View>
        <Text style={styles.mapTitle}>Your Path</Text>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={{flex: 1}} size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        {userProfile?.baseline ? (
            <FlatList
                data={STAGES}
                renderItem={renderStageItem}
                keyExtractor={item => item.stage.toString()}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={<View style={{ marginVertical: 20 }}><Button title="Sign Out" onPress={handleSignOut} color="#f44336" /></View>}
                contentContainerStyle={styles.container}
            />
        ) : (
          <View style={styles.noBaselineContainer}>
            <Text style={styles.title}>Begin Your Journey</Text>
            <Text style={styles.subtitle}>Determine your starting point on the path to greatness.</Text>
            <Button title="Start Your Journey" onPress={() => router.push('/start-journey')} color="#2196F3" />
            <View style={{marginTop: 40}}>
                <Button title="Sign Out" onPress={handleSignOut} color="#f44336" />
            </View>
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  noBaselineContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginVertical: 20 },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  statsContainer: { padding: 20, backgroundColor: '#333', borderRadius: 10, width: '100%', marginBottom: 20 },
  statText: { fontSize: 18, color: '#FFFFFF', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  mapTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginTop: 20, marginBottom: 15 },
  stageContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  currentStage: {
    borderColor: '#4CAF50',
    backgroundColor: '#2a4d2a',
  },
  stageNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccc',
    marginRight: 20,
  },
  stageTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
});

export default HomeScreen;
// This code defines the HomeScreen component, which serves as the main screen of the app.
// It displays the user's current stage in their fitness journey, allows them to log workouts, edit their profile, and sign out.