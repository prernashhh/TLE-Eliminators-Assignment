import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import StudentForm from "../components/StudentForm";
import Navbar from '../components/Navbar';
import { studentService } from '../services/api';

const StudentList = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await studentService.getAll();
        setStudents(response.data.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        // Handle error - maybe add state for error messages
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const sortedStudents = React.useMemo(() => {
    let filteredStudents = [...students];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(lowercasedFilter) ||
        student.email.toLowerCase().includes(lowercasedFilter) ||
        student.codeforcesHandle.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredStudents;
  }, [students, searchTerm, sortConfig]);

  // Function to handle viewing a student's details
  const handleViewDetails = (studentId) => {
    if (studentId) {
      navigate(`/students/${studentId}`);
    } else {
      console.error('Invalid student ID');
    }
  };

  // Function to handle editing a student
  const handleEdit = async (updatedStudent) => {
    try {
      await studentService.update(updatedStudent.id, updatedStudent);
      setStudents(students.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      ));
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // Function to handle deleting a student
  const handleDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion
  const confirmDelete = async () => {
    try {
      await studentService.delete(studentToDelete.id);
      setStudents(students.filter(student => student.id !== studentToDelete.id));
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Function to export data as CSV
  const exportToCSV = async () => {
    try {
      const response = await studentService.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };
  
  // Function to get rating color class based on CF rating
  const getRatingColorClass = (rating) => {
    if (rating < 1200) return 'text-cf-newbie';
    if (rating < 1400) return 'text-cf-pupil';
    if (rating < 1600) return 'text-cf-specialist';
    if (rating < 1900) return 'text-cf-expert';
    if (rating < 2100) return 'text-cf-candidate';
    if (rating < 2400) return 'text-cf-master';
    if (rating < 2600) return 'text-cf-grandmaster';
    if (rating < 3000) return 'text-cf-international';
    return 'text-cf-legendary';
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0 w-full">
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl font-bold leading-7 ${darkMode ? 'text-white' : 'text-gray-800'} sm:text-3xl sm:truncate`}>
              Students
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage all your enrolled students and their Codeforces data
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="max-w-lg w-full">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Search by name, email, or CF handle"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={`shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Add styling for better mobile experience */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed sm:table-auto">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {sortConfig.key === 'name' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    Email
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    Phone
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    onClick={() => requestSort('codeforcesHandle')}
                  >
                    <div className="flex items-center">
                      <span>CF Handle</span>
                      {sortConfig.key === 'codeforcesHandle' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    onClick={() => requestSort('currentRating')}
                  >
                    <div className="flex items-center">
                      <span>Current Rating</span>
                      {sortConfig.key === 'currentRating' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hidden sm:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    onClick={() => requestSort('maxRating')}
                  >
                    <div className="flex items-center">
                      <span>Max Rating</span>
                      {sortConfig.key === 'maxRating' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    Last Updated
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    Reminders
                  </th>
                  <th 
                    scope="col" 
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                {loading ? (
                  <tr key="loading-row">
                    <td colSpan="9" className="px-6 py-16 text-center">
                      <div className="flex justify-center items-center">
                        <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
                        <span className={`ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading students...</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className={`px-6 py-16 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="mt-2 text-lg font-medium">No students match your search criteria</p>
                          <p className="mt-1">Try a different search term or clear your filter</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <p className="mt-2 text-lg font-medium">No students found</p>
                          <p className="mt-1">Add a new student to get started</p>
                          <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Student
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  sortedStudents.map((student) => (
                    <tr 
                      key={student._id} 
                      className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {student.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {student.email}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm hidden lg:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {student.phone}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                        {student.codeforcesHandle}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getRatingColorClass(student.currentRating)}`}>
                        {student.currentRating}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium hidden sm:table-cell ${getRatingColorClass(student.maxRating)}`}>
                        {student.maxRating}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm hidden lg:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                            new Date(student.lastUpdated) > new Date(Date.now() - 24*60*60*1000) 
                              ? 'bg-green-400' 
                              : 'bg-amber-400'
                          } mr-2`}></div>
                          {new Date(student.lastUpdated).toLocaleString()}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm hidden xl:table-cell ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.emailReminders > 0 
                            ? (darkMode ? 'bg-yellow-800 text-yellow-100' : 'bg-yellow-100 text-yellow-800')
                            : (darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800')
                        }`}>
                          {student.emailReminders > 0 ? `${student.emailReminders} sent` : 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex space-x-3 justify-end">
                          <button 
                            onClick={() => handleViewDetails(student._id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            title="View student details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Edit student"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(student)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete student"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
          <div className={`relative z-10 max-w-md w-full mx-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <StudentForm 
                onSubmit={(newStudent) => {
                  setStudents([...students, {
                    id: Date.now(), // Use a better ID in production
                    ...newStudent,
                    currentRating: 0,
                    maxRating: 0,
                    lastUpdated: new Date().toISOString()
                  }]);
                  setIsAddModalOpen(false);
                }}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setEditingStudent(null)}></div>
          <div className={`relative z-10 max-w-md w-full mx-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Edit Student</h3>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <StudentForm 
                student={editingStudent}
                onSubmit={(updatedStudent) => {
                  setStudents(students.map(student => 
                    student.id === updatedStudent.id ? updatedStudent : student
                  ));
                  setEditingStudent(null);
                }}
                onCancel={() => setEditingStudent(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className={`relative z-10 max-w-md w-full mx-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;