import StartYourJourneyScreen from '../src/screens/StartYourJourneyScreen';

export default StartYourJourneyScreen;
// This file serves as the entry point for the Start Your Journey screen in the app.
// It imports the StartYourJourneyScreen component from the src/screens directory and exports it as the default export.
// This allows the app to render the Start Your Journey screen when the user navigates to this route.
// The StartYourJourneyScreen component is responsible for allowing users to enter their baseline fitness stats
// and calculating their initial stage based on those stats. It uses Firebase Firestore to save the user's data
// and navigate back to the home screen after saving. The component includes input fields for push-ups, sit-ups, squats, pull-ups, and 5K run time, with
// validation and error handling.
