import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Button, FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { STAGES } from '../constants/stages';

const STAGE_ICONS = [
    require('../assets/images/stage1.png'),
    require('../assets/images/stage2.png'),
    require('../assets/images/stage3.png'),
    require('../assets/images/stage4.png'),
    require('../assets/images/stage5.png'),
    require('../assets/images/stage6.png'),
    require('../assets/images/stage7.png'),
];

const ProgressTracker = ({ userProfile, latestWorkout }) => {
    if (!userProfile?.currentStage || !userProfile?.baseline) return null;
    const userStats = latestWorkout || userProfile.baseline;
    if (!userStats) return null;
    const currentStageIndex = STAGES.findIndex(s => s.stage === userProfile.currentStage.stage);
    if (currentStageIndex === STAGES.length - 1) {
        return <View style={styles.progressContainer}><Text style={styles.progressTitle}>You have reached the final stage. 🌟</Text></View>;
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

const StageItem = ({ item, isCurrent, progress }) => {
    const animatedStyle = {
        borderColor: progress.interpolate({ inputRange: [item.stage - 1, item.stage], outputRange: ['#444', '#4CAF50'], extrapolate: 'clamp' }),
        backgroundColor: progress.interpolate({ inputRange: [item.stage - 1, item.stage], outputRange: ['#333', '#2a4d2a'], extrapolate: 'clamp' }),
    };
    return (
        <Animated.View style={[styles.stageContainer, animatedStyle]}>
            <Image source={STAGE_ICONS[item.stage - 1]} style={styles.stageIcon} />
            <Text style={styles.stageTitleText}>{item.title}</Text>
        </Animated.View>
    );
};

const JourneyMapScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const currentStage = params.currentStage ? parseInt(params.currentStage, 10) : 1;
    const progress = useRef(new Animated.Value(0)).current;

    const [userProfile, setUserProfile] = useState(null);
    const [latestWorkout, setLatestWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) setUserProfile(doc.data());
            setLoading(false);
        });
        const workoutsQuery = query(collection(db, 'users', user.uid, 'workouts'), orderBy('timestamp', 'desc'), limit(1));
        const unsubscribeWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
            if (!snapshot.empty) setLatestWorkout(snapshot.docs[0].data());
        });
        return () => { unsubscribeProfile(); unsubscribeWorkouts(); };
    }, []);

    useEffect(() => {
        Animated.timing(progress, {
            toValue: currentStage,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }, [currentStage]);

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator style={{ flex: 1 }} size="large" /></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={STAGES}
                renderItem={({ item }) => <StageItem item={item} isCurrent={item.stage === currentStage} progress={progress} />}
                keyExtractor={item => item.stage.toString()}
                contentContainerStyle={styles.container}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>Your Journey Unfolds</Text>
                        <ProgressTracker userProfile={userProfile} latestWorkout={latestWorkout} />
                    </>
                }
                ListFooterComponent={<View style={{ marginTop: 20 }}><Button title="Back to Home" onPress={() => router.replace('/(tabs)')} color="#2196F3" /></View>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginVertical: 20 },
  progressContainer: { padding: 15, backgroundColor: '#2a2a2a', borderRadius: 10, width: '100%', marginBottom: 30 },
  progressTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  progressSubtitle: { fontSize: 12, color: '#aaa', fontStyle: 'italic', marginBottom: 10 },
  progressText: { fontSize: 16, color: '#ccc', marginBottom: 5 },
  stageContainer: { backgroundColor: '#333', borderRadius: 10, padding: 15, marginBottom: 15, width: '100%', flexDirection: 'row', alignItems: 'center', borderWidth: 2 },
  stageIcon: { width: 40, height: 40, marginRight: 15 },
  stageTitleText: { fontSize: 18, color: '#FFFFFF', fontWeight: '600', flex: 1 },
});

export default JourneyMapScreen;