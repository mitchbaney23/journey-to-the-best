import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../config/firebaseConfig';

const ProfileScreen = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsername = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists() && docSnap.data().username) {
                    setUsername(docSnap.data().username);
                }
            }
            setLoading(false);
        };
        fetchUsername();
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
                Alert.alert("Success!", "Your profile has been updated.", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            } catch (error) {
                Alert.alert("Error", "Could not update your profile.");
                console.error("Profile update error: ", error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Edit Your Profile</Text>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter a username"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    editable={!loading}
                />
                <Button title="Save Profile" onPress={handleSave} color="#4CAF50" disabled={loading} />
                <View style={{marginTop: 20}}>
                    <Button title="Back" onPress={() => router.back()} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 30 },
    label: { fontSize: 18, color: '#FFFFFF', marginBottom: 8 },
    input: { width: '100%', height: 50, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 15, color: '#FFFFFF', fontSize: 16, marginBottom: 20 },
});

export default ProfileScreen;
// This code defines the ProfileScreen component, which allows users to edit their profile information.
// It includes a field for the username and a button to save changes. The component fetches the current username from Firestore when it mounts and updates the user's profile in Firestore when the save