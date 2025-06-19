import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../App';
import Navbar from '../components/Navbar';

const Home = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <Navbar />
      
      {/* Hero Section with Gradient Background */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className={`block ${darkMode ? 'text-white' : 'text-gray-900'}`}>Track & Improve</span>
                  <span className={`block ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Student Progress</span>
                </h1>
                <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-black-300 dark:text-grey-300">
                  Advanced analytics for competitive programmers. Visualize rating changes, track problem-solving patterns, and identify areas for improvement.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/students"
                      className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} md:py-4 md:text-lg md:px-10 transition-colors duration-200`}
                    >
                      View Students
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Decorative Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 hidden lg:block">
          <div className={`relative h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full ${darkMode ? '' : ''}`}>
            <svg 
              className={`absolute right-0 inset-y-0 h-full w-full object-cover ${darkMode ? 'text-gray-800' : 'text-indigo-100'}`}
              fill="currentColor"
              viewBox="0 0 200 200"
            >
              <defs>
                <pattern id="8b1b5f72-e944-4457-af67-0c6d15a7f652" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className={`${darkMode ? 'text-gray-700' : 'text-gray-200'}`} fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#8b1b5f72-e944-4457-af67-0c6d15a7f652)" />
              <circle cx="100" cy="100" r="80" 
                className={`${darkMode ? 'text-indigo-900/20' : 'text-indigo-500/20'}`} 
                fill="currentColor"
              />
              <circle cx="40" cy="150" r="25" 
                className={`${darkMode ? 'text-blue-800/20' : 'text-blue-500/20'}`} 
                fill="currentColor"
              />
              <circle cx="160" cy="50" r="35" 
                className={`${darkMode ? 'text-purple-800/20' : 'text-purple-500/20'}`} 
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Features Section - Revised */}
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Add max-width to center content */}
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="inline-flex items-center justify-center p-3 rounded-md bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contest Performance
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Track rating changes and contest results with detailed visualizations
              </p>
            </div>
            
            <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="inline-flex items-center justify-center p-3 rounded-md bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Problem Solving Analysis
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Analyze problem-solving patterns, difficulty distribution, and daily activity
              </p>
            </div>
            
            <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="inline-flex items-center justify-center p-3 rounded-md bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Inactivity Reminders
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Automatic email reminders for students who haven't solved problems in 7 days
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link
            to="/students"
            className={`inline-flex items-center px-4 py-2 text-base font-medium ${
              darkMode 
                ? 'text-indigo-300 hover:text-indigo-200' 
                : 'text-indigo-600 hover:text-indigo-500'
            }`}
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;