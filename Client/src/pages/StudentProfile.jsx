import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThemeContext } from '../App';
import Navbar from '../components/Navbar';
import ContestHistory from '../components/StudentProfile/ContestHistory';
import ProblemSolvingData from '../components/StudentProfile/ProblemSolvingData';
import { studentService, codeforcesService } from '../services/api';

const StudentProfile = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('contests');
  const [loading, setLoading] = useState(true);
  const [contestData, setContestData] = useState([]);
  const [problemData, setProblemData] = useState({});
  const [timeRange, setTimeRange] = useState(30); // Default 30 days

  // Fetch student data (mock data for now)
  useEffect(() => {
    const fetchStudentData = async () => {
      // Only fetch if ID is valid
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const studentResponse = await studentService.getById(id);
        setStudent(studentResponse.data.data);
        
        // Fetch contest history
        const contestResponse = await codeforcesService.getContestHistory(id, timeRange);
        setContestData(contestResponse.data.data);
        
        // Fetch problem data
        const problemResponse = await codeforcesService.getProblemData(id, timeRange);
        setProblemData(problemResponse.data.data);
        
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [id, timeRange]);

  // Add handler for changing time range
  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
            <span className={`ml-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading student profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Student not found</h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>The student you're looking for doesn't exist or has been removed.</p>
            <div className="mt-6">
              <Link to="/students" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Back to Students
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      {/* Replace with better spacing */}
      <div className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">
        <div className="max-w-8xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link 
              to="/students" 
              className={`group inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 
                ${darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 shadow-md hover:shadow-lg' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow'
                }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1 
                  ${darkMode ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-600 group-hover:text-indigo-700'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Students</span>
            </Link>
          </div>
          
          {/* Student profile header */}
          <div className={`rounded-lg shadow-sm overflow-hidden w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
            <div className="md:flex">
              <div className="p-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</h2>
                    <div className={`mt-1 flex flex-wrap items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="inline-flex items-center mr-4 mb-2 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {student.email}
                      </span>
                      <span className="inline-flex items-center mr-4 mb-2 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {student.phone}
                      </span>
                      <span className="inline-flex items-center mb-2 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Joined {new Date(student.joinedOn).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-center md:text-right">
                      <div className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current Rating
                      </div>
                      <div className={`text-2xl font-bold ${student.currentRating < 1200 ? 'text-cf-newbie' : 
                        student.currentRating < 1400 ? 'text-cf-pupil' : 
                        student.currentRating < 1600 ? 'text-cf-specialist' : 
                        student.currentRating < 1900 ? 'text-cf-expert' : 
                        student.currentRating < 2100 ? 'text-cf-candidate' : 
                        student.currentRating < 2400 ? 'text-cf-master' : 
                        student.currentRating < 2600 ? 'text-cf-grandmaster' : 
                        student.currentRating < 3000 ? 'text-cf-international' : 'text-cf-legendary'}`}>
                        {student.currentRating}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Max: <span className="font-semibold">{student.maxRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className={`my-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className={`text-sm uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Codeforces Handle
                    </div>
                    <a 
                      href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="mt-1 text-lg font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {student.codeforcesHandle}
                    </a>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Contests
                    </div>
                    <div className={`mt-1 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {student.totalContests}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Problems Solved
                    </div>
                    <div className={`mt-1 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {student.solvedProblems}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Preferred Language
                    </div>
                    <div className={`mt-1 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {student.preferredLanguage}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'contests'
                    ? `${darkMode ? 'border-indigo-400 text-indigo-300' : 'border-indigo-600 text-indigo-600'}`
                    : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('contests')}
              >
                Contest History
              </button>
              <button
                className={`${
                  activeTab === 'problems'
                    ? `${darkMode ? 'border-indigo-400 text-indigo-300' : 'border-indigo-600 text-indigo-600'}`
                    : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('problems')}
              >
                Problem Solving Data
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="w-full">
            {activeTab === 'contests' ? (
              <ContestHistory 
                contestData={contestData}
                isLoading={loading}
                onTimeRangeChange={handleTimeRangeChange}
                timeRange={timeRange}
                darkMode={darkMode}
              />
            ) : (
              <ProblemSolvingData 
                problemData={problemData}
                isLoading={loading}
                onTimeRangeChange={handleTimeRangeChange} 
                timeRange={timeRange}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;