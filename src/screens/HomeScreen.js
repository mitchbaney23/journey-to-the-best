import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth).catch(error => console.log('Error signing out: ', error));
  };

  const ListHeader = () => (
    <>
        <Text style={styles.title}>Journey to the Best</Text>
        {userProfile?.baseline ? (
          <>
            <View style={styles.statsContainer}>
                <Text style={styles.statText}>Adventurer: {userProfile.username || userProfile.email}</Text>
                <Text style={styles.statText}>Current Stage: {userProfile.currentStage?.title || 'N/A'}</Text>
            </View>
            <View style={styles.buttonRow}>
                <Button title="Log a Workout" onPress={() => router.push('/(tabs)/log-workout')} color="#4CAF50" />
                <Button title="View Journey Map" onPress={() => router.push({ pathname: '/(tabs)/journey-map', params: { currentStage: userProfile.currentStage.stage }})} color="#00BCD4" />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Determine your starting point on the path to greatness.</Text>
            <Button title="Start Your Journey" onPress={() => router.push('/start-journey')} color="#2196F3" />
          </>
        )}
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground 
        source={require('../assets/images/background.png')} 
        style={styles.background}
        resizeMode="cover"
    >
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={[]} // We pass an empty array because we only need the header and footer for layout
                keyExtractor={() => 'dummy'}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={<View style={styles.signOutButtonContainer}><Button title="Sign Out" onPress={handleSignOut} color="#f44336" /></View>}
                contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center', 
    marginBottom: 20,
    fontFamily: 'Cinzel',
  },
  subtitle: { 
    fontSize: 18, 
    color: '#ccc', 
    textAlign: 'center', 
    marginBottom: 30, 
    paddingHorizontal: 20,
    fontFamily: 'Lora',
  },
  statsContainer: { padding: 20, backgroundColor: 'rgba(51, 51, 51, 0.8)', borderRadius: 10, width: '100%', marginBottom: 20 },
  statText: { 
    fontSize: 18, 
    color: '#FFFFFF', 
    marginBottom: 10,
    fontFamily: 'Lora',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
  signOutButtonContainer: { marginTop: 40, marginBottom: 20 },
});

export default HomeScreen;
