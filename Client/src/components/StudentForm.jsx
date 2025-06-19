import React, { useState, useContext } from 'react';
import { ThemeContext } from '../App';
import { studentService } from '../services/api';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    codeforcesHandle: student?.codeforcesHandle || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.codeforcesHandle) newErrors.codeforcesHandle = 'Codeforces handle is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      if (student) {
        // Update student
        const response = await studentService.update(student.id, formData);
        onSubmit(response.data.data);
      } else {
        // Create new student
        const response = await studentService.create(formData);
        onSubmit(response.data.data);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      // Handle API errors
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.param] = err.msg;
        });
        setErrors(apiErrors);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={`block font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 
            ${darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
            } ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className={`block font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 
            ${darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
            } ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={`block font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 
            ${darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
            } ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="codeforcesHandle" className={`block font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Codeforces Handle
        </label>
        <input
          type="text"
          id="codeforcesHandle"
          name="codeforcesHandle"
          value={formData.codeforcesHandle}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 
            ${darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
            } ${errors.codeforcesHandle ? 'border-red-500' : ''}`}
        />
        {errors.codeforcesHandle && <p className="mt-1 text-sm text-red-500">{errors.codeforcesHandle}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {student ? 'Update' : 'Add'} Student
        </button>
      </div>
    </form>
  );
};

export default StudentForm;