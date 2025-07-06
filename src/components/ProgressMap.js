import { FlatList, StyleSheet, Text, View } from 'react-native';

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

const ProgressMap = ({ currentStage }) => {
    const renderItem = ({ item }) => {
        // Check if the rendered item is the user's current stage
        const isCurrentStage = item.stage === currentStage?.stage;

        return (
            <View style={[styles.stageContainer, isCurrentStage && styles.currentStage]}>
                <Text style={styles.stageNumber}>{item.stage}</Text>
                <Text style={styles.stageTitle}>{item.title}</Text>
            </View>
        );
    };

    return (
        <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Your Path</Text>
            <FlatList
                data={STAGES}
                renderItem={renderItem}
                keyExtractor={item => item.stage.toString()}
                horizontal={true} // Makes the list scroll side-to-side
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    mapTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
        paddingLeft: 10,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    stageContainer: {
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 15,
        marginRight: 15,
        width: 150,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#444',
    },
    currentStage: {
        borderColor: '#4CAF50', // Highlight color for the current stage
        backgroundColor: '#2a4d2a',
    },
    stageNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ccc',
        position: 'absolute',
        top: 5,
        left: 10,
    },
    stageTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ProgressMap;
// This code defines the ProgressMap component, which displays the user's journey stages in a horizontal list.
// It highlights the current stage and provides a visual representation of the user's progress through the stages of their fitness journey.
// The component uses a FlatList to render each stage, with styles applied for visual clarity and emphasis on the current stage.
// The STAGES array defines the entire journey, and the component