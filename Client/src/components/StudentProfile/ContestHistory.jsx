import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ContestHistory = ({ codeforcesHandle, darkMode }) => {
  const [timeFilter, setTimeFilter] = useState('30');
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  
  // Fetch contest history (mock data)
  useEffect(() => {
    const fetchContestHistory = async () => {
      setLoading(true);
      
      // In a real app, filter would be applied in the API call
      setTimeout(() => {
        // Generate some mock contest data
        const mockContests = [];
        let rating = 1500;
        const now = new Date();
        
        // Generate contest entries going backward from today
        for (let i = 0; i < 20; i++) {
          const contestDate = new Date();
          contestDate.setDate(now.getDate() - (i * 15)); // One contest roughly every 15 days
          
          // Random rating change between -100 and +120
          const ratingChange = Math.floor(Math.random() * 220) - 100;
          rating += ratingChange;
          
          mockContests.push({
            id: i + 1,
            name: `Codeforces Round #${800 - i}`,
            date: contestDate.toISOString(),
            rank: Math.floor(Math.random() * 2000) + 1,
            oldRating: rating - ratingChange,
            newRating: rating,
            ratingChange,
            unsolvedProblems: Math.floor(Math.random() * 4)
          });
        }
        
        // Sort contests by date (newest first)
        mockContests.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Filter based on time selection
        const filteredContests = filterContestsByTime(mockContests, timeFilter);
        
        setContests(filteredContests);
        setLoading(false);
      }, 800);
    };
    
    fetchContestHistory();
  }, [codeforcesHandle, timeFilter]);
  
  // Filter contests based on time selection
  const filterContestsByTime = (allContests, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    return allContests.filter(contest => new Date(contest.date) >= cutoffDate);
  };
  
  // Prepare data for chart
  const chartData = {
    labels: contests.map(contest => {
      const date = new Date(contest.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Rating',
        data: contests.map(contest => contest.newRating).reverse(),
        fill: false,
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(79, 70, 229, 0.8)',
        borderColor: darkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(79, 70, 229, 0.8)',
        tension: 0.1,
      },
    ],
  };
  
  const chartOptions = {
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#4B5563',
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#4B5563',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#F9FAFB' : '#111827',
        },
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? '#F9FAFB' : '#111827',
        bodyColor: darkMode ? '#D1D5DB' : '#4B5563',
        borderColor: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
  };
  
  // Get CSS class for rating change
  const getRatingChangeClass = (change) => {
    if (change > 0) return 'text-green-500 dark:text-green-400';
    if (change < 0) return 'text-red-500 dark:text-red-400';
    return darkMode ? 'text-gray-400' : 'text-gray-500';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contest History</h3>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeFilter === '30' 
                ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`
                : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onClick={() => setTimeFilter('30')}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              timeFilter === '90' 
                ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`
                : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            } border-t border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onClick={() => setTimeFilter('90')}
          >
            90 Days
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeFilter === '365' 
                ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`
                : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            onClick={() => setTimeFilter('365')}
          >
            365 Days
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
          <span className={`ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading contest history...</span>
        </div>
      ) : contests.length === 0 ? (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-lg font-medium">No contests found</p>
          <p className="mt-1">No contest participation detected in the selected time period.</p>
        </div>
      ) : (
        <>
          {/* Rating graph */}
          <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 mb-6`}>
            <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rating Graph</h4>
            {/* Increase height for better visualization */}
            <div className="h-64 sm:h-80 lg:h-96 w-full">
              <Line data={chartData} options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins?.legend,
                    position: 'top'
                  }
                }
              }} />
            </div>
          </div>
          
          {/* Contests table */}
          <div className={`rounded-lg shadow-sm overflow-hidden w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h4 className={`font-medium p-4 border-b ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'}`}>
              Contest Details
            </h4>
            <div className="w-full overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Date
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Contest
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Rank
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Old Rating
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      New Rating
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Change
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Unsolved
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                  {contests.map((contest) => (
                    <tr key={contest.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(contest.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {contest.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {contest.rank}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {contest.oldRating}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {contest.newRating}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getRatingChangeClass(contest.ratingChange)}`}>
                        {contest.ratingChange > 0 ? `+${contest.ratingChange}` : contest.ratingChange}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {contest.unsolvedProblems}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContestHistory;