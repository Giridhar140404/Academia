import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

function useQuizCompletionData() {
  const [quizData, setQuizData] = useState({
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    datasets: { label: "Quizzes Completed", data: new Array(12).fill(0) },
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(collection(db, "quizCompleted"), where("userId", "==", userId));
      const snapshot = await getDocs(q);

      console.log("q", q);
      console.log("Snap", snapshot);

      const monthCounts = new Array(12).fill(0); // Jan to Dec

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        console.log("Data", data);

        // Ensure completedAt is a Firestore Timestamp and convert it
        let date;
        if (data.completedAt?.toDate) {
          date = data.completedAt.toDate();
        } else if (data.completedAt instanceof Date) {
          date = data.completedAt;
        }

        if (date) {
          const month = date.getMonth(); // 0 = Jan
          monthCounts[month]++;
        }
      });

      setQuizData({
        labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        datasets: {
          label: "Quizzes Completed",
          data: monthCounts,
        },
      });
    };

    fetchData();
  }, []);

  return quizData;
}

export default useQuizCompletionData;
