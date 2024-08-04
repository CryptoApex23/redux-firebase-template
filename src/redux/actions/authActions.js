import {
  auth,
  firestore,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "../../services/firebase"; // Adjust path
import { getAuth, updateProfile } from "firebase/auth";

const generateUsername = () => {
  const adjectives = ["Happy", "Sad", "Funny", "Angry"];
  const nouns = ["Fish", "Cat", "Dog", "Bird"];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 100);
  return `${randomAdj}${randomNoun}${randomNum}`;
};

const defaultUserData = {
  username: generateUsername(), // Automatically generated username
  email: "", // User email address
  last_login: serverTimestamp(), // Timestamp of the last login
  game_points: 100, // Initial game points
  followers: [], // List of user IDs who follow this user
  following: [], // List of user IDs this user is following
  profilePicUrl: "https://api.multiavatar.com/1231234123fsdfdsf.png",
  bio: "", // User bio
  created_at: serverTimestamp(), // Timestamp of account creation
  updated_at: serverTimestamp(), // Timestamp of the last profile update
  settings: {
    theme: "light", // User-selected theme (e.g., 'light' or 'dark')
    notifications: true, // Whether the user has enabled notifications
    language: "en", // Preferred language
  },
  achievements: [], // List of achievements or badges
  friend_requests: [], // List of pending friend requests
  message_count: 0, // Number of messages sent
  online_status: "offline", // Online status (e.g., 'online', 'offline', 'away')
  address: "", // User's address (if needed for certain features)
  phone: "", // User's phone number (if needed for certain features)
  roles: ["user"], // Roles assigned to the user (e.g., 'admin', 'user')
  last_game_played: "", // Timestamp of the last game played
  total_play_time: 0, // Total time spent playing games
  favorite_games: [], // List of user's favorite games
  // Add more fields here as needed
};

export const login = () => async (dispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    let user = result.user;
    if (user) {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const email = user.email;
      defaultUserData.email = email;
      if (!userDoc.exists()) {
        // User does not exist, create with default values
        await setDoc(userRef, defaultUserData);
        const serializedUserData = convertTimestampToDate(defaultUserData);
        user = serializedUserData;
      } else {
        // User exists, update last_login if not already set
        const userData = userDoc.data();
        const serializedUserData = convertTimestampToDate(userData);

        user = serializedUserData;
        await setDoc(
          userRef,
          { last_login: serverTimestamp() },
          { merge: true }
        );
      }

      // Dispatch login action or update Redux state
    }
    dispatch({ type: "LOGIN_SUCCESS", payload: user });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error.message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    const userAuth = auth;
    await userAuth.signOut();

    // Clear authentication state
    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  const auth = getAuth();
  const user = auth.currentUser;
  dispatch({ type: "UPDATE_PROFILE_START" });
  try {
    if (user) {
      await updateProfile(user, {
        displayName: profileData.username,
        photoURL: profileData.profilePicUrl,
      });

      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        username: profileData.username,
        bio: profileData.bio,
        profilePicUrl: profileData.profilePicUrl,
        settings: profileData.settings,
        updated_at: serverTimestamp(),
      });

      dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: profileData });
    }
  } catch (error) {
    dispatch({ type: "UPDATE_PROFILE_ERROR", payload: error.message });
    throw error; // Re-throw to handle in the component
  }
};

export const fetchUserProfile = (userId) => async (dispatch) => {
  dispatch({
    type: "GETTING_DATA",
  });
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const serializedUserData = convertTimestampToDate(userData);
      dispatch({
        type: "SET_USER",
        payload: serializedUserData,
      });
    }
  }
};

const convertTimestampToDate = (userData) => {
  if (userData.last_login && userData.last_login.toDate) {
    userData.last_login = userData.last_login.toDate().toString();
  }
  if (userData.created_at && userData.created_at.toDate) {
    userData.created_at = userData.created_at.toDate().toString();
  }
  if (userData.updated_at && userData.updated_at.toDate) {
    userData.updated_at = userData.updated_at.toDate().toString();
  }
  return userData;
};
