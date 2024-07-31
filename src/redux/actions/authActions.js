import { auth, firestore, GoogleAuthProvider, signInWithPopup, doc, setDoc, getDoc, serverTimestamp } from '../../services/firebase'; // Adjust path

const generateUsername = () => {
  const adjectives = ['Happy', 'Sad', 'Funny', 'Angry'];
  const nouns = ['Fish', 'Cat', 'Dog', 'Bird'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 100);
  return `${randomAdj}${randomNoun}${randomNum}`;
};

const defaultUserData = {
  username: generateUsername(),
  email: '',
  last_login: serverTimestamp(),
  game_points: 100,
  followers: [],
  following: [],
  // Add more fields here as needed
};


export const login = () => async (dispatch) => {
  dispatch({ type: 'LOGIN_REQUEST' });

  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const email = user.email;
      defaultUserData.email = email;
      if (!userDoc.exists()) {
        // User does not exist, create with default values
        await setDoc(userRef, defaultUserData);
      } else {
        // User exists, update last_login if not already set
        const userData = userDoc.data();
        console.log("User Exists");
        await setDoc(userRef, { last_login: serverTimestamp() }, { merge: true });

      }

      // Dispatch login action or update Redux state

    }

    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await auth.signOut();
    console.log('Logging out');

    // Clear authentication state
    dispatch({ type: 'LOGOUT' });


  } catch (error) {
    console.error('Error logging out:', error.message);
  }
};
