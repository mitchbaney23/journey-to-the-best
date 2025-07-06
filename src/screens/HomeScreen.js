import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

// The STAGES array defines the entire journey, now with requirements
const STAGES = [
    { stage: 1, title: "🌱 Awakened Seeker", requirements: { pushups: 10, situps: 20, squats: 20, pullups: 0, run5kMinutes: 45 } },
    { stage: 2, title: "🍂 Pathfinder", requirements: { pushups: 20, situps: 30, squats: 30, pullups: 1, run5kMinutes: 40 } },
    { stage: 3, title: "🌸 Disciple", requirements: { pushups: 30, situps: 40, squats: 50, pullups: 3, run5kMinutes: 35 } },
    { stage: 4, title: "🪷 Enlightened Warrior", requirements: { pushups: 50, situps: 50, squats: 75, pullups: 5, run5kMinutes: 30 } },
    { stage: 5, title: "🏔️ Mountain Sage", requirements: { pushups: 70, situps: 75, squats: 90, pullups: 10, run5kMinutes: 27 } },
    { stage: 6, title: "🔥 Heavenly Champion", requirements: { pushups: 90, situps: 90, squats: 100, pullups: 15, run5kMinutes: 25 } },
    { stage: 7, title: "👑 Monkey King Ascended", requirements: { pushups: 100, situps: 100, squats: 100, pullups: 20, run5kMinutes: 24.98 } }
];

// This component now uses the most recent workout to calculate progress
const ProgressTracker = ({ userProfile, latestWorkout }) => {
    if (!userProfile?.currentStage || !userProfile?.baseline) return null;

    // Prioritize the latest workout's stats, otherwise fall back to the baseline
    const userStats = latestWorkout || userProfile.baseline;
    if (!userStats) return null; // Extra guard clause

    const currentStageIndex = STAGES.findIndex(s => s.stage === userProfile.currentStage.stage);
    
    if (currentStageIndex === STAGES.length - 1) {
        return (
            <View style={styles.progressContainer}>
                <Text style={styles.progressTitle}>You have reached the final stage. 🌟</Text>
            </View>
        );
    }

    const nextStage = STAGES[currentStageIndex + 1];
    const nextReq = nextStage.requirements;

    const progress = {
        pushups: Math.max(0, nextReq.pushups - (userStats.pushups || 0)),
        situps: Math.max(0, nextReq.situps - (userStats.situps || 0)),
        squats: Math.max(0, nextReq.squats - (userStats.squats || 0)),
        pullups: Math.max(0, nextReq.pullups - (userStats.pullups || 0)),
        run5k: Math.max(0, (userStats.run5kTotalMinutes || 999) - nextReq.run5kMinutes),
    };

    return (
        <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progress to: {nextStage.title}</Text>
            <Text style={styles.progressSubtitle}>(Based on your last workout)</Text>
            {progress.pushups > 0 && <Text style={styles.progressText}>Push-ups: {progress.pushups} more</Text>}
            {progress.situps > 0 && <Text style={styles.progressText}>Sit-ups: {progress.situps} more</Text>}
            {progress.squats > 0 && <Text style={styles.progressText}>Squats: {progress.squats} more</Text>}
            {progress.pullups > 0 && <Text style={styles.progressText}>Pull-ups: {progress.pullups} more</Text>}
            {(userStats.run5kTotalMinutes || 999) > nextReq.run5kMinutes && <Text style={styles.progressText}>5K Time: Improve by {progress.run5k.toFixed(2)} mins</Text>}
        </View>
    );
};


const HomeScreen = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [latestWorkout, setLatestWorkout] = useState(null); // <-- State for latest workout
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Listener for user profile
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            setUserProfile(doc.data());
        } else {
            console.log("No such document!");
        }
        setLoading(false);
    });

    // Listener for the most recent workout
    const workoutsQuery = query(
        collection(db, 'users', user.uid, 'workouts'),
        orderBy('timestamp', 'desc'),
        limit(1)
    );
    const unsubscribeWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
        if (!snapshot.empty) {
            setLatestWorkout(snapshot.docs[0].data());
        }
    });

    return () => {
        unsubscribeProfile();
        unsubscribeWorkouts();
    };
  }, []);

  const handleSignOut = () => {
    signOut(auth).catch(error => console.log('Error signing out: ', error));
  };

  const renderStageItem = ({ item }) => {
    const isCurrentStage = item.stage === userProfile?.currentStage?.stage;
    return (
        <View style={[styles.stageContainer, isCurrentStage && styles.currentStage]}>
            <Text style={styles.stageNumber}>{item.stage}</Text>
            <Text style={styles.stageTitleText}>{item.title}</Text>
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
        <ProgressTracker userProfile={userProfile} latestWorkout={latestWorkout} />
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
  progressContainer: { padding: 15, backgroundColor: '#2a2a2a', borderRadius: 10, width: '100%', marginBottom: 20 },
  progressTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  progressSubtitle: { fontSize: 12, color: '#aaa', fontStyle: 'italic', marginBottom: 10 },
  progressText: { fontSize: 16, color: '#ccc', marginBottom: 5 },
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
  stageTitleText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
});

export default HomeScreen;
// This code defines the HomeScreen component, which serves as the main screen of the app.
// It displays the user's current stage, allows them to log workouts, edit their profile, and view their progress.
// The component uses Firebase Firestore to fetch the user's profile and latest workout data,
// and it includes a progress tracker that shows how close the user is to reaching the next stage