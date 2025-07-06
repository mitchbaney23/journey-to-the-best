import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (initializing) {
                setInitializing(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return { user, initializing };
}
// This custom hook, useAuth, listens for authentication state changes using Firebase's onAuthStateChanged method.