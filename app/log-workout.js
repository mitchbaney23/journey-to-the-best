import WorkoutLogScreen from '../src/screens/WorkoutLogScreen';

export default WorkoutLogScreen;

// This file serves as the entry point for the Workout Log screen in the app.
// It imports the WorkoutLogScreen component from the src/screens directory and exports it as the default export.
// This allows the app to render the Workout Log screen when the user navigates to this route.
// The WorkoutLogScreen component is responsible for displaying the user's workout logs, allowing them to view their
// past workouts, and providing options to filter or sort the logs. It uses Firebase Firestore to fetch the user's workout data
// and displays it in a user-friendly format. The component is styled for a clean, modern look, with a focus on user experience.
// The use of hooks like