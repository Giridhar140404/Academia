// src/context/AuthContext.js
import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-logout timer (optional: e.g. 30 mins)
  useEffect(() => {
    let timer;
    if (currentUser) {
      timer = setTimeout(() => {
        signOut(auth);
        setCurrentUser(null);
        localStorage.removeItem("token");
      }, 30 * 60 * 1000); // 30 minutes
    }
    return () => clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem("token", token); // persist session
          setCurrentUser(user);
        });
      } else {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>{!loading && children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
