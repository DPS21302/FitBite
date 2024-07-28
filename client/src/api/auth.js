import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`; 

export const saveUserToDatabase = async (user) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const response = await axios.post(`${API_URL}/saveUser`, {
      firebaseUid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};