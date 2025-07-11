import { useRouter } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

const ProfileScreen = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch initial username
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists() && docSnap.data().username) {
                setUsername(docSnap.data().username);
            }
        });

        // Listener for workout history
        const workoutsColRef = collection(db, 'users', user.uid, 'workouts');
        const q = query(workoutsColRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkoutHistory(history);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    const handleSave = async () => {
        if (username.trim() === '') {
            Alert.alert("Invalid Username", "Username cannot be empty.");
            return;
        }
        const user = auth.currentUser;
        if (user) {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, { username: username }, { merge: true });
                Alert.alert("Success!", "Your profile has been updated.");
            } catch (error) {
                Alert.alert("Error", "Could not update your profile.");
            }
        }
    };

    const renderHeader = () => (
        <>
            <Text style={styles.title}>Your Profile</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter a username"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                />
                <Button title="Save Profile" onPress={handleSave} color="#4CAF50" />
            </View>
            <Text style={styles.historyTitle}>Workout History</Text>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={workoutHistory}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.historyDate}>{item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</Text>
                        <Text style={styles.historyText}>Pushups: {item.pushups}, Situps: {item.situps}, Squats: {item.squats}, Pullups: {item.pullups}</Text>
                        <Text style={styles.historyText}>5K: {item.run5kMinutes}m {item.run5kSeconds}s</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No workouts logged yet.</Text>}
                contentContainerStyle={styles.container}
                ListFooterComponent={<View style={{ marginVertical: 20 }}><Button title="Back to Home" onPress={() => router.replace('/(tabs)')} /></View>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
    container: { paddingHorizontal: 20, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginVertical: 20 },
    formContainer: { backgroundColor: '#2a2a2a', padding: 20, borderRadius: 10, marginBottom: 30 },
    label: { fontSize: 18, color: '#FFFFFF', marginBottom: 8 },
    input: { width: '100%', height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', fontSize: 16, marginBottom: 20 },
    historyTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 },
    historyItem: { backgroundColor: '#333', padding: 10, borderRadius: 5, marginBottom: 10 },
    historyDate: { color: '#ccc', fontSize: 12, marginBottom: 5 },
    historyText: { color: '#FFFFFF', fontSize: 14 },
    emptyText: { color: '#ccc', textAlign: 'center', marginTop: 20 },
});

export default ProfileScreen;
