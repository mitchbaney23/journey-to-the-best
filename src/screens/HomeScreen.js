import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>🏆 Welcome to Journey to the Best</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a', // A dark background color
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    textAlign: 'center',
  },
});

export default HomeScreen;
// This is the HomeScreen component for the Journey to the Best app.
// It displays a welcome message with a trophy emoji.