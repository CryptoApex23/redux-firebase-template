import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc

} from "firebase/firestore";
import {  ref, set, push, onValue, get,serverTimestamp, orderByChild, equalTo } from "firebase/database";
import { database } from "./firebase";

const db = getFirestore();

const generateChatId = () => {
  return Math.random().toString(36).substr(2, 9); // Generates a random string of 9 characters
};

// Function to search users by username
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

export const searchUsersById = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  let user = {};
  if (userDoc.exists()) {
    // Document exists, you can access the data
    const userData = userDoc.data();
    user = userData;
    console.log('User data:', userData);
  } else {
    // Document does not exist
    console.log('No such user!');
  }
  return user;
};

// Function to create a chat
export const createChat = async (userIds) => {

  try{
    const chatId = generateChatId(); // Generate a random chat ID
    const chatRef = ref(database, `chats/${chatId}`);
    const chatSnapshot = await get(chatRef);
    console.log("created")

    if (!chatSnapshot.exists()) {
      await set(chatRef, {
        participants: userIds,
        createdAt: serverTimestamp(),
      });
    }
    return chatId;
  }catch(e){
    console.log(e)
  }
 

};

// Function to send a message
export const sendMessage = async (chatId, message, user,id) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    user: user.username,
    userId:id,
    text: message,
    timestamp: serverTimestamp(),
  });
};

// Function to listen for messages in a chat
export const onMessageListener = (chatId, callback) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);
    callback(messages);
  });

  return unsubscribe;
};

export const getUserChats = async (userId) => {
  const chatsRef = ref(database, 'chats');
  const chatSnapshot = await get(chatsRef);

  if (!chatSnapshot.exists()) return [];

  const chatData = chatSnapshot.val();
  const chats = Object.keys(chatData).map(chatId => ({
    chatId,
    ...chatData[chatId],
  }));

  // Filter chats where userId is in participants array
  const userChats = chats.filter(chat => chat.participants.includes(userId));

  // Fetch the last message in each chat
  const chatWithLastMessagePromises = userChats.map(async (chat) => {
    const messagesRef = ref(database, `chats/${chat.chatId}/messages`);
    const messagesSnapshot = await get(messagesRef);
    const messages = messagesSnapshot.val() || {};
    const lastMessage = messages ? Object.values(messages).pop() : null;

    return {
      chatId: chat.chatId,
      participants: chat.participants,
      lastMessage: lastMessage ? lastMessage.text : 'No messages yet',
      lastMessageTimestamp: lastMessage ? lastMessage.timestamp : 0,
    };
  });

  return Promise.all(chatWithLastMessagePromises);
};

export const getChatParticipants = async (chatId) => {
  const chatRef = ref(database, `chats/${chatId}`);
  const chatSnapshot = await get(chatRef);
  return chatSnapshot.val().participants;
};