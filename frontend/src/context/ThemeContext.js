import React, { createContext, useState, useContext } from 'react';

// Create the Context
const ThemeContext = createContext();

// Create a Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the Theme Context easily
export const useTheme = () => useContext(ThemeContext);