import { useRouter } from 'expo-router';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

const STAGES = [
    { stage: 1, title: "🌱 Awakened Seeker", requirements: { pushups: 10, situps: 20, squats: 20, pullups: 0, run5kMinutes: 45 } },
    { stage: 2, title: "🍂 Pathfinder", requirements: { pushups: 20, situps: 30, squats: 30, pullups: 1, run5kMinutes: 40 } },
    { stage: 3, title: "🌸 Disciple", requirements: { pushups: 30, situps: 40, squats: 50, pullups: 3, run5kMinutes: 35 } },
    { stage: 4, title: "🪷 Enlightened Warrior", requirements: { pushups: 50, situps: 50, squats: 75, pullups: 5, run5kMinutes: 30 } },
    { stage: 5, title: "🏔️ Mountain Sage", requirements: { pushups: 70, situps: 75, squats: 90, pullups: 10, run5kMinutes: 27 } },
    { stage: 6, title: "🔥 Heavenly Champion", requirements: { pushups: 90, situps: 90, squats: 100, pullups: 15, run5kMinutes: 25 } },
    { stage: 7, title: "👑 Monkey King Ascended", requirements: { pushups: 100, situps: 100, squats: 100, pullups: 20, run5kMinutes: 24.98 } }
];

const WorkoutLogScreen = () => {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pushups: '', situps: '', squats: '', pullups: '', run5kMinutes: '', run5kSeconds: ''
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            setUserProfile(doc.data());
            setLoading(false);
        });

        const workoutsColRef = collection(db, 'users', user.uid, 'workouts');
        const q = query(workoutsColRef, orderBy('timestamp', 'desc'));
        const unsubscribeWorkouts = onSnapshot(q, (snapshot) => {
            const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkoutHistory(history);
        });

        return () => {
            unsubscribeProfile();
            unsubscribeWorkouts();
        };
    }, []);

    const handleInputChange = (name, value) => {
        setStats(prevStats => ({ ...prevStats, [name]: value }));
    };
    
    const calculateStage = (performance) => {
        for (let i = STAGES.length - 1; i >= 0; i--) {
            const stage = STAGES[i];
            const req = stage.requirements;
            if (
                performance.pushups >= req.pushups &&
                performance.situps >= req.situps &&
                performance.squats >= req.squats &&
                performance.pullups >= req.pullups &&
                performance.run5kTotalMinutes <= req.run5kMinutes
            ) {
                return stage;
            }
        }
        return STAGES[0];
    };

    const handleLogWorkout = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const currentWorkout = {
            pushups: Number(stats.pushups) || 0,
            situps: Number(stats.situps) || 0,
            squats: Number(stats.squats) || 0,
            pullups: Number(stats.pullups) || 0,
            run5kMinutes: Number(stats.run5kMinutes) || 0,
            run5kSeconds: Number(stats.run5kSeconds) || 0,
        };
        currentWorkout.run5kTotalMinutes = currentWorkout.run5kMinutes + (currentWorkout.run5kSeconds / 60);

        const workoutsColRef = collection(db, 'users', user.uid, 'workouts');
        await addDoc(workoutsColRef, {
            ...currentWorkout,
            timestamp: serverTimestamp()
        });

        const bestPerformance = userProfile.bestPerformance || userProfile.baseline;
        const newBest = { ...bestPerformance };
        let hasNewBest = false;

        if (currentWorkout.pushups > bestPerformance.pushups) { newBest.pushups = currentWorkout.pushups; hasNewBest = true; }
        if (currentWorkout.situps > bestPerformance.situps) { newBest.situps = currentWorkout.situps; hasNewBest = true; }
        if (currentWorkout.squats > bestPerformance.squats) { newBest.squats = currentWorkout.squats; hasNewBest = true; }
        if (currentWorkout.pullups > bestPerformance.pullups) { newBest.pullups = currentWorkout.pullups; hasNewBest = true; }
        if (currentWorkout.run5kTotalMinutes < bestPerformance.run5kTotalMinutes) { 
            newBest.run5kTotalMinutes = currentWorkout.run5kTotalMinutes; 
            newBest.run5kMinutes = currentWorkout.run5kMinutes;
            newBest.run5kSeconds = currentWorkout.run5kSeconds;
            hasNewBest = true; 
        }

        if (hasNewBest) {
            const newStage = calculateStage(newBest);
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                bestPerformance: newBest,
                currentStage: newStage
            }, { merge: true });

            if (newStage.stage > userProfile.currentStage.stage) {
                Alert.alert("Stage Up!", `You have ascended to a new stage: ${newStage.title}`);
            } else {
                 Alert.alert("New Record!", "You've set a new personal best!");
            }
        } else {
            Alert.alert("Workout Logged!", "Great work! Keep pushing your limits.");
        }
        setStats({ pushups: '', situps: '', squats: '', pullups: '', run5kMinutes: '', run5kSeconds: '' });
    };

    const renderHeader = () => (
        <>
            <Text style={styles.title}>{userProfile?.currentStage?.title || 'Log Your Workout'}</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Log Today's Workout</Text>
                <TextInput style={styles.input} placeholder="Push-ups" value={stats.pushups} onChangeText={v => handleInputChange('pushups', v)} keyboardType="number-pad" />
                <TextInput style={styles.input} placeholder="Sit-ups" value={stats.situps} onChangeText={v => handleInputChange('situps', v)} keyboardType="number-pad" />
                <TextInput style={styles.input} placeholder="Squats" value={stats.squats} onChangeText={v => handleInputChange('squats', v)} keyboardType="number-pad" />
                <TextInput style={styles.input} placeholder="Pull-ups" value={stats.pullups} onChangeText={v => handleInputChange('pullups', v)} keyboardType="number-pad" />
                <View style={styles.timeContainer}>
                    <TextInput style={styles.timeInput} placeholder="5K Mins" value={stats.run5kMinutes} onChangeText={v => handleInputChange('run5kMinutes', v)} keyboardType="number-pad" />
                    <Text style={styles.timeSeparator}>:</Text>
                    <TextInput style={styles.timeInput} placeholder="5K Secs" value={stats.run5kSeconds} onChangeText={v => handleInputChange('run5kSeconds', v)} keyboardType="number-pad" />
                </View>
                <Button title="Log Workout" onPress={handleLogWorkout} color="#4CAF50" />
            </View>
            <Text style={styles.label}>Workout History</Text>
        </>
    );

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator style={{flex: 1}} size="large" /></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={workoutHistory}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.historyDate}>{item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</Text>
                        <Text style={styles.historyText}>Pushups: {item.pushups}, Situps: {item.situps}, Squats: {item.squats}, Pullups: {item.pullups}</Text>
                        <Text style={styles.historyText}>5K: {item.run5kMinutes}m {item.run5kSeconds}s</Text>
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={<Button title="Back to Home" onPress={() => router.back()} />}
                ListEmptyComponent={<Text style={styles.historyText}>No workouts logged yet.</Text>}
                contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
    container: { paddingVertical: 20, paddingHorizontal: 15 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20 },
    formContainer: { backgroundColor: '#2a2a2a', padding: 15, borderRadius: 10, marginBottom: 20 },
    label: { fontSize: 20, fontWeight: '600', color: '#FFFFFF', marginBottom: 15 },
    input: { height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', fontSize: 16, marginBottom: 10 },
    timeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    timeInput: { flex: 1, height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', fontSize: 16, textAlign: 'center' },
    timeSeparator: { color: '#FFFFFF', fontSize: 24, marginHorizontal: 10 },
    historyItem: { backgroundColor: '#333', padding: 10, borderRadius: 5, marginBottom: 10 },
    historyDate: { color: '#ccc', fontSize: 12, marginBottom: 5 },
    historyText: { color: '#FFFFFF', fontSize: 14, textAlign: 'center' },
});

export default WorkoutLogScreen;
