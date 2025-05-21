import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";
import { setDoc, doc, increment } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const useCoursePageAnalytics = () => {
  const location = useLocation();
  const isCoursePage = location.pathname.startsWith("/courses/");
  const startTime = Date.now();

  console.log("Location: ", location);
  console.log("CoursePage: ", isCoursePage);

  useEffect(() => {
    if (!isCoursePage) return;

    const pathParts = location.pathname.split("/");
    const courseName = pathParts.length >= 3 ? pathParts[2] : "Unknown";

    console.log("Path parts", pathParts);
    console.log("courseName: ", courseName);

    console.log("Current user:", auth.currentUser.uid);

    logEvent(analytics, "page_view", {
      page_path: location.pathname,
    });

    return () => {
      const endTime = Date.now();
      console.log("End Time: ", endTime);
      const timeSpentSeconds = Math.floor((endTime - startTime) / 1000);
      const user = auth.currentUser;
      console.log("User", user);
      if (!user) return;

      const now = new Date();
      const month = now.toISOString().slice(0, 7); // e.g., 2025-05
      const day = now.toISOString().slice(0, 10); // e.g., 2025-05-20
      const pathKey = location.pathname.replace(/\//g, "_");

      const monthlyDocId = `${user.uid}_${pathKey}_${month}`;
      const dailyDocId = `${user.uid}_${day}`;

      // --- Monthly View ---
      try {
        setDoc(
          doc(db, "course_page_views", monthlyDocId),
          {
            userId: user.uid,
            path: location.pathname,
            courseName,
            month,
            lastVisited: now.getTime(),
            timeSpent: increment(timeSpentSeconds),
          },
          { merge: true }
        );
        console.log("Monthly course view tracked.");
      } catch (err) {
        console.error("Error writing to course_page_views:", err);
      }

      // --- Daily View ---
      try {
        setDoc(
          doc(db, "course_daily_activity", dailyDocId),
          {
            userId: user.uid,
            date: day,
            weekday: now.toLocaleDateString("en-US", { weekday: "long" }),
            timeSpent: increment(timeSpentSeconds),
          },
          { merge: true }
        );
        console.log("Daily course activity tracked.");
      } catch (err) {
        console.error("Error writing to course_daily_activity:", err);
      }
    };
  }, [location]);
};

export default useCoursePageAnalytics;
