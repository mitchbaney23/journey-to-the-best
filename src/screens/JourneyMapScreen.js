import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Button, FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Assume you have your stage icons in this path
const STAGE_ICONS = [
    require('../assets/images/stage1.png'),
    require('../assets/images/stage2.png'),
    require('../assets/images/stage3.png'),
    require('../assets/images/stage4.png'),
    require('../assets/images/stage5.png'),
    require('../assets/images/stage6.png'),
    require('../assets/images/stage7.png'),
];

const STAGES = [
    { stage: 1, title: "🌱 Awakened Seeker" },
    { stage: 2, title: "🍂 Pathfinder" },
    { stage: 3, title: "🌸 Disciple" },
    { stage: 4, title: "🪷 Enlightened Warrior" },
    { stage: 5, title: "🏔️ Mountain Sage" },
    { stage: 6, title: "🔥 Heavenly Champion" },
    { stage: 7, title: "👑 Monkey King Ascended" }
];

const StageItem = ({ item, isCurrent, progress }) => {
    const animatedStyle = {
        borderColor: progress.interpolate({
            inputRange: [item.stage - 1, item.stage],
            outputRange: ['#444', '#4CAF50'], // From gray to green
            extrapolate: 'clamp',
        }),
        backgroundColor: progress.interpolate({
            inputRange: [item.stage - 1, item.stage],
            outputRange: ['#333', '#2a4d2a'], // From dark to highlighted
            extrapolate: 'clamp',
        }),
    };

    return (
        <Animated.View style={[styles.stageContainer, isCurrent && styles.currentStage, animatedStyle]}>
            <Image source={STAGE_ICONS[item.stage - 1]} style={styles.stageIcon} />
            <Text style={styles.stageTitleText}>{item.title}</Text>
        </Animated.View>
    );
};

const JourneyMapScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const currentStage = params.currentStage ? parseInt(params.currentStage, 10) : 1;
    
    // Animation value
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate the progress value to the user's current stage
        Animated.timing(progress, {
            toValue: currentStage,
            duration: 1500, // Animation lasts 1.5 seconds
            useNativeDriver: false, // backgroundColor/borderColor animation needs this
        }).start();
    }, [currentStage]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.title}>Your Journey Unfolds</Text>
            <FlatList
                data={STAGES}
                renderItem={({ item }) => (
                    <StageItem 
                        item={item} 
                        isCurrent={item.stage === currentStage} 
                        progress={progress}
                    />
                )}
                keyExtractor={item => item.stage.toString()}
                contentContainerStyle={styles.container}
            />
            <View style={styles.buttonContainer}>
                <Button title="Return to Home" onPress={() => router.replace('/(tabs)')} color="#2196F3" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a1a' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginVertical: 20 },
  stageContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
  },
  currentStage: {
    // Extra style for the current stage, e.g., a shadow or thicker border if needed
  },
  stageIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  stageTitleText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  }
});

export default JourneyMapScreen;