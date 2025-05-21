import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKDAY_KEYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const useDailyActivityData = () => {
  const [chartData, setChartData] = useState({
    labels: WEEKDAYS,
    datasets: { label: "Time Spent (sec)", data: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const now = new Date();
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        return d.toISOString().slice(0, 10);
      });

      const q = query(collection(db, "course_daily_activity"), where("userId", "==", user.uid));

      const snapshot = await getDocs(q);
      const rawData = snapshot.docs.map((doc) => doc.data());

      // Build a weekday→timeSpent map with 0 default
      const timeByWeekday = WEEKDAY_KEYS.reduce((acc, weekday) => {
        acc[weekday] = 0;
        return acc;
      }, {});

      for (const item of rawData) {
        if (last7Days.includes(item.date)) {
          timeByWeekday[item.weekday] += item.timeSpent || 0;
        }
      }

      const finalData = WEEKDAY_KEYS.map((day) => timeByWeekday[day]);
      setChartData({
        labels: WEEKDAYS,
        datasets: {
          label: "Time Spent (sec)",
          data: finalData,
        },
      });
    };

    fetchData();
  }, []);

  return chartData;
};

export default useDailyActivityData;
