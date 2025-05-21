import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchQuizById } from "./fetchQuiz";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;
const PageTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #2b6cb0;
  font-weight: 700;
  font-family: "Segoe UI", sans-serif;
`;

// Layout
const Layout = styled.div`
  display: flex;
  max-width: 1100px;
  margin: 60px auto;
  font-family: "Segoe UI", sans-serif;
  gap: 24px;
`;

const QuizContainer = styled.div`
  flex: 3;
  padding: 30px;
  border-radius: 16px;
  background: linear-gradient(to bottom right, #ffffff, #f0f4ff);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Sidebar = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 16px;
  background: #f9fafc;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 60px;
`;

const SidebarTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 16px;
`;

const QuestionStatus = styled.ul`
  list-style: none;
  padding: 0;
`;

// Quiz Elements
const QuestionCard = styled.div`
  padding: 25px;
  border-radius: 14px;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  animation: ${fadeIn} 0.4s ease;
`;

const QuestionTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 18px;
  color: #222;
`;

const Option = styled.div`
  padding: 14px;
  border-radius: 10px;
  margin-top: 12px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#d7ecff" : "#f5f7fb")};
  border: 2px solid ${({ selected }) => (selected ? "#007aff" : "transparent")};
  transition: all 0.2s;

  &:hover {
    background-color: #ebf4ff;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const NavButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  background-color: ${({ primary }) => (primary ? "#007aff" : "#4a5568")};
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${({ primary }) => (primary ? "#0061cc" : "#2d3748")};
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  height: 10px;
  margin-bottom: 24px;
`;

const ProgressFill = styled.div`
  background-color: #3182ce;
  height: 100%;
  width: ${({ percent }) => percent}%;
  transition: width 0.3s ease;
`;

const Timer = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #e53e3e;
  text-align: right;
  margin-bottom: 10px;
`;

const ResultCard = styled.div`
  background: #f0fff4;
  border: 2px solid #38a169;
  border-radius: 14px;
  padding: 25px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`;

const ScoreText = styled.div`
  font-size: 24px;
  color: #22543d;
  font-weight: bold;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    rgb(60, 91, 114),
    rgb(45, 83, 112)
  ); /* Blue gradient */
  padding: 40px 20px;
`;
// Replace StatusItem with StatusButton styled component
const StatusButton = styled.button`
  width: 36px;
  height: 36px;
  margin: 6px 6px 6px 0;
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? "700" : "500")};
  color: ${({ attempted, isActive }) => (isActive ? "#fff" : attempted ? "#2f855a" : "#c53030")};
  background-color: ${({ isActive }) => (isActive ? "#3182ce" : "#f5f7fb")};
  border: 2px solid
    ${({ isActive, attempted }) => (isActive ? "#3182ce" : attempted ? "#2f855a" : "#c53030")};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#2c5282" : "#ebf4ff")};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.6);
  }
`;

// Main Component
const QuizPage = () => {
  const { courseName, quizId } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!courseName || !quizId) return;
    fetchQuizById(courseName, quizId)
      .then((questions) => {
        setQuizData(questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [courseName, quizId]);
  useEffect(() => {
    if (score !== null || isTimeUp) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true); // mark time as up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [score, isTimeUp]);

  const handleAnswerSelection = (selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    const totalQuestions = quizData.length;
    const answeredCount = Object.keys(selectedAnswers).length;

    if (answeredCount < totalQuestions) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    let difficultyStats = {};

    quizData.forEach((q, i) => {
      const isCorrect = selectedAnswers[i] === q.answer;
      if (isCorrect) correctCount++;

      const level = q.difficulty || "unknown";
      if (!difficultyStats[level]) {
        difficultyStats[level] = { total: 0, correct: 0 };
      }
      difficultyStats[level].total++;
      if (isCorrect) difficultyStats[level].correct++;
    });

    const wrongCount = totalQuestions - correctCount;
    setScore(correctCount);

    try {
      await addDoc(collection(db, "quizCompleted"), {
        quizId,
        courseName,
        userId: auth.currentUser.uid,
        score: correctCount,
        totalQuestions,
        wrongAnswers: wrongCount,
        correctAnswers: correctCount,
        difficultyStats,
        completedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }
  };

  const nextQuestion = () => setCurrentIndex((prev) => prev + 1);
  const prevQuestion = () => setCurrentIndex((prev) => prev - 1);

  if (loading) return <p>Loading...</p>;
  if (!quizData) return <p>No quiz data found.</p>;

  const currentQuestion = quizData[currentIndex];
  const progressPercent = ((currentIndex + 1) / quizData.length) * 100;

  return (
    <PageWrapper>
      <Layout>
        <QuizContainer>
          <PageTitle>Quiz: {quizId}</PageTitle>

          {score === null && !isTimeUp ? (
            <>
              <Timer>Time left: {timeLeft}s</Timer>
              <ProgressBar>
                <ProgressFill percent={progressPercent} />
              </ProgressBar>

              <QuestionCard>
                <QuestionTitle>
                  {currentIndex + 1}. {currentQuestion.question}
                </QuestionTitle>
                {currentQuestion.options.map((opt, idx) => (
                  <Option
                    key={idx}
                    selected={selectedAnswers[currentIndex] === opt}
                    onClick={() => handleAnswerSelection(opt)}
                  >
                    {opt}
                  </Option>
                ))}
              </QuestionCard>

              <ButtonRow>
                <NavButton onClick={prevQuestion} disabled={currentIndex === 0}>
                  Previous
                </NavButton>
                {currentIndex < quizData.length - 1 ? (
                  <NavButton onClick={nextQuestion}>Next</NavButton>
                ) : (
                  <NavButton primary onClick={handleSubmit}>
                    Submit
                  </NavButton>
                )}
              </ButtonRow>
            </>
          ) : isTimeUp ? (
            <ResultCard style={{ background: "#fff5f5", borderColor: "#e53e3e" }}>
              <h2 style={{ color: "#c53030", marginBottom: "16px" }}>⏰ Time`&#39;`s up!</h2>
              <p style={{ marginBottom: "24px", fontSize: "18px" }}>The quiz time has expired.</p>
              <ButtonRow style={{ justifyContent: "center" }}>
                <NavButton onClick={() => window.location.reload()} primary>
                  Retry Quiz
                </NavButton>
                <Link
                  to={`/courses/${courseName}`}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Back to Course
                </Link>
              </ButtonRow>
            </ResultCard>
          ) : (
            <ResultCard>
              <h2>🎉 Quiz Complete!</h2>
              <ScoreText>
                You scored {score} / {quizData.length}
              </ScoreText>
              <ButtonRow style={{ marginTop: "20px" }}>
                <NavButton onClick={() => window.location.reload()}>Retry Quiz</NavButton>
                <Link
                  to={`/courses/${courseName}`}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Back to Course
                </Link>
              </ButtonRow>
            </ResultCard>
          )}
        </QuizContainer>

        {/* Sidebar */}
        <Sidebar>
          <SidebarTitle>Quiz Overview</SidebarTitle>
          <p>Total Questions: {quizData.length}</p>
          <p>Attempted: {Object.keys(selectedAnswers).length}</p>
          <QuestionStatus style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {quizData.map((_, index) => (
              <StatusButton
                key={index}
                attempted={selectedAnswers.hasOwnProperty(index)}
                isActive={currentIndex === index}
                onClick={() => setCurrentIndex(index)}
                title={`Go to Question ${index + 1}`}
                aria-label={`Question ${index + 1} ${
                  selectedAnswers.hasOwnProperty(index) ? "✅" : "❌"
                }`}
              >
                {index + 1}
              </StatusButton>
            ))}
          </QuestionStatus>
        </Sidebar>
      </Layout>
    </PageWrapper>
  );
};

export default QuizPage;
