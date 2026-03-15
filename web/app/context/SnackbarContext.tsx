// SnackbarContext.js
import React, { createContext, useState, useCallback, useEffect } from "react";
import Snackbar from "./Snackbar";

// ryoes
type SnackbarType = "success" | "warning" | "error";

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  show: boolean;
}


export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    show: false,
  });

  const showSnackbar = useCallback((message, type) => {
    setSnackbar({ message, type, show: true });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar((prevSnackbar) => ({ ...prevSnackbar, show: false }));
  }, []);

  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show, hideSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        show={snackbar.show}
      />
    </SnackbarContext.Provider>
  );
};
