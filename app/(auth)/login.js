import LoginScreen from '../../src/screens/LoginScreen';
export default LoginScreen;
//// This file serves as the entry point for the Login screen in the app.
// It imports the LoginScreen component from the src/screens directory and exports it as the default export.
// This allows the app to render the Login screen when the user navigates to this route.
// The LoginScreen component is responsible for handling user authentication, including login and registration.
// It uses Firebase Authentication to manage user accounts and navigate to the home screen upon successful login.
// The component includes input fields for email and password, with validation and error handling.
// If the user is not registered, they can create a new account, which will also use Firebase to create a new user.
// The LoginScreen is styled to fit the overall theme of the app, with a dark background and light text.
// It provides a user-friendly interface for authentication, ensuring a smooth user experience when starting their journey with the app.