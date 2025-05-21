import { useState, useEffect } from "react";
import { auth, db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

function useUserCourseViews() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: { label: "Course Views", data: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const q = query(collection(db, "course_page_views"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());

      // Initialize data for all 12 months with 0
      const fullMonthLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
      const fullMonthKeys = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      const monthlyViews = {};
      fullMonthKeys.forEach((month) => (monthlyViews[month] = 0));

      // Sum timeSpent per month
      data.forEach(({ month, timeSpent }) => {
        const monthNumber = month.split("-")[1]; // "2025-05" -> "05"
        if (monthlyViews[monthNumber] !== undefined) {
          monthlyViews[monthNumber] += timeSpent;
        }
      });

      const values = fullMonthKeys.map((month) => monthlyViews[month]);

      setChartData({
        labels: fullMonthLabels,
        datasets: {
          label: "Course Views",
          data: values,
        },
      });
    };

    fetchData();
  }, []);

  return chartData;
}

export default useUserCourseViews;
