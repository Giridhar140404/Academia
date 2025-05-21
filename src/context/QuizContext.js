import { createContext, useContext } from "react";

export const initialState = {
  currentScreen: "SplashScreen",
  setCurrentScreen: () => {},
  quizTopic: "React",
  selectQuizTopic: () => {},
  questions: [],
  setQuestions: () => {},
  result: [],
  setResult: () => {},
  timer: 15,
  setTimer: () => {},
  endTime: 0,
  setEndTime: () => {},
  quizDetails: {
    totalQuestions: 0,
    totalScore: 0,
    totalTime: 0,
    selectedQuizTopic: "React",
  },
};

export const QuizContext = createContext(initialState);

export function useQuiz() {
  return useContext(QuizContext);
}
