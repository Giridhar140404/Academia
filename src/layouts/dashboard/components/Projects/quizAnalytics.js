import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

function QuizAnalytics() {
  const [rows, setRows] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState({});
  const [courseStats, setCourseStats] = useState({});

  const columns = [
    { Header: "Quiz ID", accessor: "quizId", align: "left" },
    { Header: "Course", accessor: "course", align: "left" },
    { Header: "Accuracy", accessor: "accuracy", align: "center" },
  ];

  useEffect(() => {
    const fetchQuizData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(collection(db, "quizCompleted"), where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const tempRows = [];
      const diffStats = {};
      const courseStatsMap = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const { quizId, courseName, score, totalQuestions, difficultyStats } = data;

        const accuracy = ((score / totalQuestions) * 100).toFixed(2) + "%";

        tempRows.push({ quizId, course: courseName, accuracy });

        // Difficulty-wise stats
        Object.entries(difficultyStats).forEach(([level, stats]) => {
          if (!diffStats[level]) diffStats[level] = { correct: 0, total: 0 };
          diffStats[level].correct += stats.correct;
          diffStats[level].total += stats.total;
        });

        // Course-wise stats
        if (!courseStatsMap[courseName]) courseStatsMap[courseName] = { correct: 0, total: 0 };
        courseStatsMap[courseName].correct += score;
        courseStatsMap[courseName].total += totalQuestions;
      });

      // Process difficulty stats
      const difficultyAccuracy = {};
      Object.entries(diffStats).forEach(([level, stats]) => {
        difficultyAccuracy[level] = ((stats.correct / stats.total) * 100).toFixed(2) + "%";
      });

      // Process course stats
      const courseAccuracy = {};
      Object.entries(courseStatsMap).forEach(([course, stats]) => {
        courseAccuracy[course] = ((stats.correct / stats.total) * 100).toFixed(2) + "%";
      });

      setRows(tempRows);
      setDifficultyStats(difficultyAccuracy);
      setCourseStats(courseAccuracy);
    };

    fetchQuizData();
  }, []);

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" gutterBottom>
          Quiz Completion Analytics
        </MDTypography>

        <MDBox mt={2} mb={2}>
          <MDTypography variant="button" fontWeight="bold">
            📊 Difficulty-wise Performance:
          </MDTypography>
          {Object.entries(difficultyStats).map(([level, acc]) => (
            <MDTypography key={level} variant="button">
              {level}: {acc}
            </MDTypography>
          ))}
        </MDBox>

        <MDBox mt={2} mb={2}>
          <MDTypography variant="button" fontWeight="bold">
            📚 Course-wise Performance:
          </MDTypography>
          {Object.entries(courseStats).map(([course, acc]) => (
            <MDTypography key={course} variant="button">
              {course}: {acc}
            </MDTypography>
          ))}
        </MDBox>

        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

export default QuizAnalytics;
