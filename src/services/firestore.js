import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

export const searchUsersByUsername = async (username) => {
  const q = query(
    collection(db, "users"),
    where("username", ">=", username),
    where("username", "<=", username + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};
