import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust the path as needed

export const fetchQuizById = async (collectionName, quizId) => {
  const quizRef = doc(db, collectionName, quizId);
  const quizSnap = await getDoc(quizRef);

  if (quizSnap.exists()) {
    return quizSnap.data().questions || []; // return the questions array
  } else {
    throw new Error("Quiz not found");
  }
};
