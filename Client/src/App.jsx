import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import StudentList from './pages/StudentList';
import StudentProfile from './pages/StudentProfile'; 
import { AuthProvider } from './context/AuthContext';

// Create a theme context to share between components
export const ThemeContext = React.createContext({
  darkMode: false,
  toggleDarkMode: () => {}
});

function App() {
  // Initialize theme from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  // Theme toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update localStorage and DOM when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;