// src/AlreadyLoggedInRoute.js
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const AlreadyLoggedInRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : children;
};

AlreadyLoggedInRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AlreadyLoggedInRoute;
