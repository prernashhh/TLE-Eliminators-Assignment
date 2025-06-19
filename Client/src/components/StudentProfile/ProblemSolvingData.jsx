import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProblemSolvingData = ({ codeforcesHandle, darkMode }) => {
  const [timeFilter, setTimeFilter] = useState('30');
  const [loading, setLoading] = useState(true);
  const [problemData, setProblemData] = useState({
    mostDifficult: null,
    totalProblems: 0,
    averageRating: 0,
    averagePerDay: 0,
    ratingDistribution: {}
  });

  // Add this state for heatmap cells data
  const [heatmapCells, setHeatmapCells] = useState([]);

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoading(true);
      
      // Simulate API call with a timeout
      setTimeout(() => {
        // Generate mock problem solving data
        const mockData = generateMockData(timeFilter);
        setProblemData(mockData);
        
        // Generate heatmap cells data
        const days = parseInt(timeFilter, 10);
        const cells = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        // Create cell data for each day in the range
        for (let i = 0; i < 90; i++) { // Generate 90 days of data for 3-month view
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          // Random number of submissions (0-5)
          const submissions = Math.floor(Math.random() * 6);
          cells.push({
            date: dateStr,
            dayOfWeek: date.getDay(),
            dayOfMonth: date.getDate(),
            month: date.getMonth(),
            submissions,
            intensity: submissions === 0 ? 0 : Math.min(Math.ceil(submissions / 2), 4)
          });
        }
        
        setHeatmapCells(cells);
        setLoading(false);
      }, 800);
    };
    
    fetchProblemData();
  }, [codeforcesHandle, timeFilter]);
  
  // Function to generate mock data based on time filter
  const generateMockData = (days) => {
    // Generate different data based on the time filter
    const daysNum = parseInt(days);
    
    // Mock problem ratings distribution
    const ratings = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400];
    const distribution = {};
    
    // Generate random distribution with more problems in middle ratings
    ratings.forEach(rating => {
      let count = 0;
      if (rating < 1200) {
        count = Math.floor(Math.random() * 5) + 1; // 1-5 problems
      } else if (rating < 1800) {
        count = Math.floor(Math.random() * 10) + 5; // 5-15 problems
      } else if (rating < 2200) {
        count = Math.floor(Math.random() * 8) + 3; // 3-11 problems
      } else {
        count = Math.floor(Math.random() * 3) + 1; // 1-4 problems
      }
      distribution[rating] = count;
    });
    
    // Adjust total count based on time filter
    const totalMultiplier = days === '7' ? 0.3 : days === '30' ? 1 : 2.5;
    const totalProblems = Math.floor(Object.values(distribution).reduce((sum, count) => sum + count, 0) * totalMultiplier);
    
    // Calculate other metrics
    const averageRating = ratings.reduce((sum, rating) => sum + rating * distribution[rating], 0) / 
                         Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    return {
      mostDifficult: {
        name: "Three Sum",
        rating: 2300,
        contestId: 1234,
        index: "E",
        solvedDate: new Date(Date.now() - Math.floor(Math.random() * daysNum * 24 * 60 * 60 * 1000)).toISOString()
      },
      totalProblems,
      averageRating: Math.round(averageRating),
      averagePerDay: (totalProblems / daysNum).toFixed(1),
      ratingDistribution: distribution
    };
  };

  // Format chart data for rating distribution
  const chartData = {
    labels: Object.keys(problemData.ratingDistribution).map(r => r),
    datasets: [
      {
        label: 'Problems Solved',
        data: Object.values(problemData.ratingDistribution),
        backgroundColor: darkMode ? 'rgba(79, 70, 229, 0.8)' : 'rgba(99, 102, 241, 0.8)',
        borderColor: darkMode ? 'rgba(79, 70, 229, 1)' : 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Problem Rating',
          color: darkMode ? '#D1D5DB' : '#4B5563',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#4B5563',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Problems',
          color: darkMode ? '#D1D5DB' : '#4B5563',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#4B5563',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? '#F9FAFB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#4B5563',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      }
    }
  };

  // Simplified heatmap generation
  const generateHeatMap = () => {
    // Show last 30 days by default, adjustable by timeFilter
    const days = parseInt(timeFilter, 10);
    const cells = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    // Create a map to hold actual submission data (would come from API)
    const submissionsByDate = {};
    
    // In real implementation, this would be populated from problemData prop
    // For now, generate sample data
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Random number of submissions (0-5)
      const submissions = Math.floor(Math.random() * 6);
      submissionsByDate[dateStr] = submissions;
    }
    
    // Group by week for better visualization
    const weeks = [];
    let currentWeek = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      const submissions = submissionsByDate[dateStr] || 0;
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push({
        date: dateStr,
        dayOfWeek,
        dayOfMonth: date.getDate(),
        month: date.getMonth(),
        submissions,
        intensity: submissions === 0 ? 0 : Math.min(Math.ceil(submissions / 2), 4)
      });
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return {
      days: Object.keys(submissionsByDate).map(date => ({
        date,
        submissions: submissionsByDate[date]
      })),
      weeks
    };
  };
  
  const heatmapData = generateHeatMap();

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Problem Solving Data</h3>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeFilter === '7' 
                ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`
                : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onClick={() => setTimeFilter('7')}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              timeFilter === '30' 
                ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`
                : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            } border-t border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onClick={() => setTimeFilter('30')}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeFilter === '90' 
                ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`
                : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onClick={() => setTimeFilter('90')}
          >
            90 Days
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
          <span className={`ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading problem solving data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Key metrics */}
          <div className={`rounded-lg shadow-sm p-6 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Most difficult problem */}
            <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Most Difficult Problem</h4>
            <div className="mb-6">
              <div className="flex flex-wrap items-center">
                <span className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mr-2`}>
                  {problemData.mostDifficult.name} ({problemData.mostDifficult.contestId}{problemData.mostDifficult.index})
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {problemData.mostDifficult.rating}
                </span>
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Solved on {new Date(problemData.mostDifficult.solvedDate).toLocaleDateString()}
              </div>
            </div>
            
            {/* Stats grid with better spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              <div>
                <div className={`text-sm uppercase font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Problems
                </div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {problemData.totalProblems}
                </div>
              </div>
              
              <div>
                <div className={`text-sm uppercase font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Average Rating
                </div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {problemData.averageRating}
                </div>
              </div>
              
              <div>
                <div className={`text-sm uppercase font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Avg. Per Day
                </div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {problemData.averagePerDay}
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating distribution chart */}
          <div className={`rounded-lg shadow-sm p-6 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Problems by Rating</h4>
            <div className="h-64 sm:h-80 lg:h-96">
              <Bar data={chartData} options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false
              }} />
            </div>
          </div>
        </div>
      )}
      
      {/* Submission heatmap - improved styling */}
      <div className={`rounded-lg shadow-sm p-6 mt-6 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Submission Activity
          </h4>
          <div className="flex items-center">
            <span className={`text-xs mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last 3 months
            </span>
            <div className="flex items-center gap-1 text-xs">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Less</span>
              <div className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-green-900/70' : 'bg-green-100'} border ${darkMode ? 'border-green-800' : 'border-green-200'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-green-700/80' : 'bg-green-200'} border ${darkMode ? 'border-green-600' : 'border-green-300'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-green-500/90' : 'bg-green-300'} border ${darkMode ? 'border-green-400' : 'border-green-400'}`}></div>
              <div className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-green-400' : 'bg-green-500'} border ${darkMode ? 'border-green-300' : 'border-green-600'}`}></div>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>More</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="min-w-max">
            {/* Month labels with clear separation */}
            <div className="flex text-xs pl-8 mb-1">
              {Array.from({ length: 3 }).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - 2 + i);
                const monthName = date.toLocaleString('default', { month: 'long' });
                const monthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                
                // Calculate width based on number of days in month
                const weeksInMonth = Math.ceil((monthDays + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
                
                return (
                  <div 
                    key={i} 
                    className={`${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'} font-medium flex-shrink-0 border-r last:border-r-0`}
                    style={{ width: `${weeksInMonth * 29}px` }}
                  >
                    <div className="pl-2">{monthName}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex">
              {/* Days of week labels */}
              <div className={`text-xs mr-2 pt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="h-5 mb-1">Sun</div>
                <div className="h-5 mb-1">Mon</div>
                <div className="h-5 mb-1">Tue</div>
                <div className="h-5 mb-1">Wed</div>
                <div className="h-5 mb-1">Thu</div>
                <div className="h-5 mb-1">Fri</div>
                <div className="h-5">Sat</div>
              </div>
              
              {/* Heatmap grid with month separators */}
              <div className="grid grid-flow-col gap-1">
                {(() => {
                  // Generate full 3 month calendar grid
                  const today = new Date();
                  const threeMonthsAgo = new Date(today);
                  threeMonthsAgo.setMonth(today.getMonth() - 2);
                  threeMonthsAgo.setDate(1); // Start from first day of month
                  
                  const weeks = [];
                  let currentDate = new Date(threeMonthsAgo);
                  let weekIndex = 0;
                  
                  // Continue until we reach current month's end
                  while (
                    currentDate.getMonth() <= today.getMonth() ||
                    currentDate.getFullYear() < today.getFullYear()
                  ) {
                    // For each week
                    const week = [];
                    const firstDayOfWeek = new Date(currentDate);
                    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Move to beginning of week (Sunday)
                    
                    // Check if this week crosses month boundary for styling
                    const monthStart = firstDayOfWeek.getMonth();
                    const isMonthBoundary = Array.from({ length: 7 }).some((_, i) => {
                      const day = new Date(firstDayOfWeek);
                      day.setDate(firstDayOfWeek.getDate() + i);
                      return day.getMonth() !== monthStart;
                    });
                    
                    weeks.push(
                      <div 
                        key={weekIndex} 
                        className={`grid grid-rows-7 gap-1 ${isMonthBoundary ? 'pr-2 border-r border-gray-300 dark:border-gray-700' : ''}`}
                        data-week={getWeekNumber(firstDayOfWeek)}
                        data-month={firstDayOfWeek.getMonth() + 1}
                      >
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          const day = new Date(firstDayOfWeek);
                          day.setDate(firstDayOfWeek.getDate() + dayIndex);
                          
                          // Format date string to match cell data
                          const dateStr = day.toISOString().split('T')[0];
                          
                          // Find if we have submission data for this day
                          const cell = { intensity: 0, submissions: 0, date: dateStr };
                          const matchingDay = heatmapData.days.find(day => day.date === dateStr);
                          if (matchingDay) {
                            cell.submissions = matchingDay.submissions;
                            cell.intensity = matchingDay.submissions === 0 ? 0 : Math.min(Math.ceil(matchingDay.submissions / 2), 4);
                          }
                          
                          // Create proper date object for display
                          const formattedDate = day.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          });
                          
                          // Determine if this date should be shown (within the 3-month range)
                          const isInRange = day <= today && day >= threeMonthsAgo;
                          
                          // Determine background color based on intensity with improved gradient
                          let cellStyle = {};
                          if (darkMode) {
                            if (cell.intensity === 0) cellStyle = { backgroundColor: '#1F2937', border: '1px solid #374151' };
                            else if (cell.intensity === 1) cellStyle = { backgroundColor: 'rgba(6, 78, 59, 0.8)', border: '1px solid #065f46' };
                            else if (cell.intensity === 2) cellStyle = { backgroundColor: 'rgba(4, 120, 87, 0.8)', border: '1px solid #047857' };
                            else if (cell.intensity === 3) cellStyle = { backgroundColor: 'rgba(16, 185, 129, 0.8)', border: '1px solid #10b981' };
                            else if (cell.intensity === 4) cellStyle = { backgroundColor: '#34D399', border: '1px solid #6ee7b7' };
                          } else {
                            if (cell.intensity === 0) cellStyle = { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' };
                            else if (cell.intensity === 1) cellStyle = { backgroundColor: '#ECFDF5', border: '1px solid #D1FAE5' };
                            else if (cell.intensity === 2) cellStyle = { backgroundColor: '#A7F3D0', border: '1px solid #6EE7B7' };
                            else if (cell.intensity === 3) cellStyle = { backgroundColor: '#6EE7B7', border: '1px solid #34D399' };
                            else if (cell.intensity === 4) cellStyle = { backgroundColor: '#10B981', border: '1px solid #059669' };
                          }
                          
                          // If not in range, use even more muted color
                          if (!isInRange) {
                            cellStyle = { 
                              backgroundColor: darkMode ? '#111827' : '#F3F4F6', 
                              border: `1px solid ${darkMode ? '#1F2937' : '#E5E7EB'}`,
                              opacity: 0.5
                            };
                          }
                          
                          return (
                            <div 
                              key={dayIndex} 
                              className="w-5 h-5 rounded-sm transition-all duration-200 hover:scale-110 hover:z-10"
                              style={cellStyle}
                              title={isInRange ? `${cell.submissions} submissions on ${formattedDate}` : formattedDate}
                              data-date={dateStr}
                              data-count={cell.submissions}
                            >
                              {isInRange && cell.submissions > 0 && (
                                <span className="sr-only">{cell.submissions} submissions on {formattedDate}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                    
                    // Advance to next week
                    currentDate.setDate(currentDate.getDate() + 7);
                    weekIndex++;
                  }
                  
                  return weeks;
                })()}
              </div>
            </div>
            
            {/* Submission count information */}
            <div className="mt-4 pl-8 text-xs text-right">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {heatmapData.days.reduce((total, day) => total + day.submissions, 0)} submissions in the last {timeFilter} days
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submission activity - simplified version */}
      <div className={`rounded-lg shadow-sm p-6 mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Submission Activity
          </h4>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
            <span className={`ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading activity data...</span>
          </div>
        ) : (
          <div>
            {/* Activity timeline - simplified bar chart style */}
            <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="relative">
                {/* Month labels */}
                <div className="flex justify-between mb-2 text-xs text-gray-500">
                  {Array.from({ length: 3 }).map((_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    return (
                      <div key={i} className="flex-1 text-center">
                        {date.toLocaleString('default', { month: 'short' })}
                      </div>
                    );
                  })}
                </div>
                
                {/* Activity bars */}
                <div className="h-24 flex items-end space-x-1">
                  {heatmapData.days.map((day, i) => {
                    const height = day.submissions ? (day.submissions * 20) + '%' : '5%';
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    const isActive = day.submissions > 0;
                    
                    return (
                      <div 
                        key={day.date} 
                        className="flex-1 min-w-1 rounded-t transition-all"
                        style={{ 
                          height,
                          backgroundColor: isActive 
                            ? darkMode 
                              ? `rgba(99, 102, 241, ${0.3 + (day.submissions * 0.14)})` 
                              : `rgba(79, 70, 229, ${0.3 + (day.submissions * 0.14)})` 
                            : darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)'
                        }}
                        title={`${day.date}: ${day.submissions} submissions`}
                      >
                        {isToday && (
                          <div className="w-full h-0.5 bg-red-500 absolute bottom-0"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Date indicators */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Today</span>
                  <span>{timeFilter} days ago</span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-end mt-4 text-xs text-gray-500">
                <span className="mr-2">Less</span>
                {[0, 1, 2, 3, 4].map(level => (
                  <div 
                    key={level}
                    className="w-3 h-3 mx-0.5 rounded-sm"
                    style={{ 
                      backgroundColor: level === 0
                        ? (darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)')
                        : darkMode 
                          ? `rgba(99, 102, 241, ${0.3 + (level * 0.14)})` 
                          : `rgba(79, 70, 229, ${0.3 + (level * 0.14)})`
                    }}
                  ></div>
                ))}
                <span className="ml-2">More</span>
              </div>
              
              {/* Summary */}
              <div className="mt-4 text-center">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                  {heatmapData.days.reduce((total, day) => total + day.submissions, 0)} submissions in the last {timeFilter} days
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSolvingData;

// Helper function to get week number
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};