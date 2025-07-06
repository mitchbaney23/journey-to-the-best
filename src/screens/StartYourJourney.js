import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

const StartYourJourney = () => {
    const router = useRouter();
    const [stats, setStats] = useState({
        pushups: '',
        situps: '',
        squats: '',
        pullups: '',
        run5kMinutes: '',
        run5kSeconds: ''
    });

    const handleInputChange = (name, value) => {
        setStats(prevStats => ({ ...prevStats, [name]: value }));
    };

    const calculateStage = (baseline) => {
        let assignedStage = null;
        // Iterate backwards to find the highest stage qualified for
        for (let i = STAGES.length - 1; i >= 0; i--) {
            const stage = STAGES[i];
            const req = stage.requirements;
            if (
                baseline.pushups >= req.pushups &&
                baseline.situps >= req.situps &&
                baseline.squats >= req.squats &&
                baseline.pullups >= req.pullups &&
                baseline.run5kTotalMinutes <= req.run5kMinutes
            ) {
                assignedStage = stage;
                break; // Found the highest stage, no need to check lower ones
            }
        }
        return assignedStage;
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be logged in to save your stats.");
            return;
        }

        // Convert all stats to numbers, defaulting to 0 if empty
        const baseline = {
            pushups: Number(stats.pushups) || 0,
            situps: Number(stats.situps) || 0,
            squats: Number(stats.squats) || 0,
            pullups: Number(stats.pullups) || 0,
            run5kMinutes: Number(stats.run5kMinutes) || 0,
            run5kSeconds: Number(stats.run5kSeconds) || 0,
        };
        baseline.run5kTotalMinutes = baseline.run5kMinutes + (baseline.run5kSeconds / 60);

        const assignedStage = calculateStage(baseline);
        // If no stage requirements are met, default to the first stage (Awakened Seeker)
        const finalStage = assignedStage || STAGES[0];

        try {
            const userDocRef = doc(db, 'users', user.uid);
            // Use setDoc with merge: true. This will create the document if it doesn't exist,
            // or update it if it does, preventing the "no document to update" error.
            await setDoc(userDocRef, {
                baseline: baseline,
                currentStage: finalStage
            }, { merge: true });

            Alert.alert(
                "Your Journey Begins!",
                `Congratulations — you are now a ${finalStage.title}!`,
                [{ text: "OK", onPress: () => router.replace('/') }] // Go back to home screen
            );

        } catch (error) {
            console.error("Error saving data: ", error);
            Alert.alert("Error", "Could not save your stats. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Enter Your Baseline</Text>
                <Text style={styles.subtitle}>Be honest! This is your starting point.</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Max Push-ups</Text>
                    <TextInput style={styles.input} value={stats.pushups} onChangeText={v => handleInputChange('pushups', v)} keyboardType="number-pad" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Max Sit-ups</Text>
                    <TextInput style={styles.input} value={stats.situps} onChangeText={v => handleInputChange('situps', v)} keyboardType="number-pad" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Max Squats</Text>
                    <TextInput style={styles.input} value={stats.squats} onChangeText={v => handleInputChange('squats', v)} keyboardType="number-pad" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Max Pull-ups</Text>
                    <TextInput style={styles.input} value={stats.pullups} onChangeText={v => handleInputChange('pullups', v)} keyboardType="number-pad" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>5K Run Time</Text>
                    <View style={styles.timeContainer}>
                        <TextInput style={styles.timeInput} placeholder="Mins" placeholderTextColor="#888" value={stats.run5kMinutes} onChangeText={v => handleInputChange('run5kMinutes', v)} keyboardType="number-pad" />
                        <Text style={styles.timeSeparator}>:</Text>
                        <TextInput style={styles.timeInput} placeholder="Secs" placeholderTextColor="#888" value={stats.run5kSeconds} onChangeText={v => handleInputChange('run5kSeconds', v)} keyboardType="number-pad" />
                    </View>
                </View>

                <Button title="Save and Start My Journey" onPress={handleSave} color="#4CAF50" />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
    container: { padding: 20, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#ccc', marginBottom: 30 },
    inputGroup: { width: '100%', marginBottom: 20 },
    label: { fontSize: 18, color: '#FFFFFF', marginBottom: 8 },
    input: { width: '100%', height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', fontSize: 16 },
    timeContainer: { flexDirection: 'row', alignItems: 'center' },
    timeInput: { flex: 1, height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', fontSize: 16, textAlign: 'center' },
    timeSeparator: { color: '#FFFFFF', fontSize: 24, marginHorizontal: 10 },
});

export default StartYourJourney;
// This code defines the StartYourJourney component, which allows users to enter their baseline fitness stats and calculates their initial stage based on those stats. It uses Firebase Firestore to save the user's data and navigate back to the home screen after saving. The component includes input fields for push-ups, sit-ups, squats, pull-ups, and 5K run time, with validation and error handling.
// The stages are defined in the STAGES array, and the user's stage is determined based on their input. The component uses a scrollable view to accommodate smaller screens and provides a clean, user