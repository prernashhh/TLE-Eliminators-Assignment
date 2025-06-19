const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('../models/Student');
const ContestData = require('../models/ContestData');
const ProblemData = require('../models/ProblemData');
const Setting = require('../models/Setting');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample CF handles (these exist on Codeforces)
const cfHandles = [
  'psharmaTLE', 'tourist', 'RahulKundu', 'aryanc403', 'eklavyaa', 
  'priyansh31dec', 'parth_0501', 'SpongeBob', 'SakshiGupta', 'codeninja1999',
  'kcahdog', 'KEPLER', 'Tanmay219', 'CoderForces', 'Ritam13'
];

// Indian names for students
const indianNames = [
  'Prerna Sharma',
  'Rahul Verma',
  'Ananya Patel',
  'Aryan Chauhan',
  'Neha Singh',
  'Vikram Khanna',
  'Divya Agarwal',
  'Rohan Malhotra',
  'Sakshi Gupta',
  'Karthik Reddy',
  'Tanvi Joshi',
  'Rishi Kumar',
  'Nandini Desai',
  'Arjun Mehta',
  'Ishita Banerjee'
];

// Generate random rating based on handle reputation, with special treatment for Prerna
const getRandomRating = (name, handle) => {
  // Assign Prerna the highest rating
  if (name === 'Prerna Sharma') return 2600;
  
  // Other ratings
  if (handle === 'tourist') return 3200 + Math.floor(Math.random() * 200); // Still high, but below Prerna
  if (['aryanc403', 'eklavyaa'].includes(handle)) return 2100 + Math.floor(Math.random() * 300);
  if (['priyansh31dec', 'parth_0501'].includes(handle)) return 1900 + Math.floor(Math.random() * 200);
  if (['RahulKundu', 'SpongeBob', 'SakshiGupta'].includes(handle)) return 1700 + Math.floor(Math.random() * 200);
  return 1200 + Math.floor(Math.random() * 600); // Random rating for others
};

// Programming language distribution
const languages = ['C++', 'Python', 'Java', 'C#', 'JavaScript', 'Go', 'Rust'];
const randomLanguage = () => languages[Math.floor(Math.random() * languages.length)];

// Generate a student object
const createStudent = (index) => {
  const name = indianNames[index];
  const handle = cfHandles[index % cfHandles.length];
  const currentRating = getRandomRating(name, handle);
  const maxRating = name === 'Prerna Sharma' ? 
    2700 : // Prerna's max rating
    currentRating + Math.floor(Math.random() * 120); // Max rating for others
  
  // Calculate last submission date - make Prerna very active
  let lastSubmissionDate;
  if (name === 'Prerna Sharma') {
    // Prerna has very recent activity (within 2 days)
    lastSubmissionDate = new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000));
  } else if (index % 5 === 0) {
    // Make some students inactive (no submission for 8-14 days)
    lastSubmissionDate = new Date(Date.now() - Math.floor((8 + Math.random() * 6) * 24 * 60 * 60 * 1000));
  } else {
    // Active students (submission within 7 days)
    lastSubmissionDate = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
  }
  
  return {
    name,
    email: name.toLowerCase().replace(/\s+/g, '.') + '@example.com',
    phone: `+91${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    codeforcesHandle: handle,
    currentRating,
    maxRating,
    totalContests: name === 'Prerna Sharma' ? 35 : 5 + Math.floor(Math.random() * 25),
    solvedProblems: name === 'Prerna Sharma' ? 650 : 50 + Math.floor(Math.random() * 450),
    preferredLanguage: name === 'Prerna Sharma' ? 'C++' : randomLanguage(),
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)),
    lastSubmissionDate,
    emailReminders: Math.floor(Math.random() * 5),
    emailRemindersEnabled: name === 'Prerna Sharma' ? true : Math.random() > 0.2, // Prerna has reminders enabled
    joinedOn: name === 'Prerna Sharma' ? 
      new Date(Date.now() - Math.floor(365 * 24 * 60 * 60 * 1000)) : // Prerna joined a year ago
      new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
  };
};

// Generate more realistic contest data for a student
const createContestData = (studentId, studentName, daysAgo) => {
  const contestDate = new Date();
  contestDate.setDate(contestDate.getDate() - daysAgo);
  
  // Range of contests from 1200 to 1900
  const contestNumber = 1200 + Math.floor(Math.random() * 700);
  
  // Generate rating based on student name and daysAgo
  const isPrerna = studentName === 'Prerna Sharma';
  
  // Prerna's rating progression shows steady improvement
  let oldRating;
  if (isPrerna) {
    // Start with lower rating in older contests, increase over time
    const baseRating = 1800; // Starting rating
    const maxRating = 2600; // Current rating
    const progression = 1 - (daysAgo / 365); // 0-1 scale of progress
    oldRating = baseRating + Math.floor(progression * (maxRating - baseRating));
  } else {
    // Other students have more random ratings
    const baseDifficulty = daysAgo > 180 ? 1200 : 1500;
    oldRating = baseDifficulty + Math.floor((365 - Math.min(daysAgo, 365)) * 0.8);
  }
  
  // Rating changes - Prerna gets more positive changes
  let ratingChange;
  if (isPrerna) {
    ratingChange = Math.random() > 0.2 ? 
      Math.floor(Math.random() * 120) + 10 : // 80% chance of positive change (10-130)
      Math.floor(Math.random() * 60) - 60;   // 20% chance of negative change (-60-0)
  } else {
    ratingChange = Math.floor(Math.random() * 140) - 50; // Between -50 and +90
  }
  
  const contestTypes = ['Codeforces Round', 'Educational Codeforces Round', 'Codeforces Div. 2', 'Codeforces Div. 3'];
  const contestType = contestTypes[Math.floor(Math.random() * contestTypes.length)];
  
  return {
    student: studentId,
    cfContestId: contestNumber,
    name: `${contestType} #${contestNumber}`,
    date: contestDate,
    rank: isPrerna ? 
      100 + Math.floor(Math.random() * 900) : // Prerna gets better ranks (100-999)
      1000 + Math.floor(Math.random() * 10000), // Others get ranks 1000-11000
    oldRating,
    newRating: oldRating + ratingChange,
    ratingChange,
    unsolvedProblems: isPrerna ? 
      Math.floor(Math.random() * 2) : // Prerna solves most problems (0-1 unsolved)
      Math.floor(Math.random() * 5)   // Others have 0-4 unsolved
  };
};

// Generate realistic problem data
const createProblemData = (studentId, studentName, daysAgo) => {
  const solvedDate = new Date();
  solvedDate.setDate(solvedDate.getDate() - daysAgo);
  
  const contestId = 1200 + Math.floor(Math.random() * 700);
  const indexes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  const isPrerna = studentName === 'Prerna Sharma';
  // Prerna solves more difficult problems
  let index;
  if (isPrerna) {
    const indexDistribution = daysAgo < 30 ? 
      ['C', 'D', 'E', 'F', 'G', 'H'] : // Recent problems are harder
      ['B', 'C', 'D', 'E', 'F'];       // Older problems are medium difficulty
    index = indexDistribution[Math.floor(Math.random() * indexDistribution.length)];
  } else {
    index = indexes[Math.floor(Math.random() * (daysAgo < 90 ? indexes.length : 4))]; // Others solve easier problems
  }
  
  // Problem names based on common CF problem themes
  const problemThemes = [
    'Array Manipulation', 'String Operations', 'Binary Search',
    'Dynamic Programming', 'Graph Traversal', 'Tree Query',
    'Segment Tree', 'Math Problem', 'Number Theory',
    'Greedy Algorithm', 'Constructive Algorithm', 'Bitmasks'
  ];
  
  const theme = problemThemes[Math.floor(Math.random() * problemThemes.length)];
  
  // Adjust difficulty based on the index
  let rating;
  if (index === 'A') rating = 800 + Math.floor(Math.random() * 300);
  else if (index === 'B') rating = 900 + Math.floor(Math.random() * 400);
  else if (index === 'C') rating = 1200 + Math.floor(Math.random() * 400);
  else if (index === 'D') rating = 1500 + Math.floor(Math.random() * 400);
  else if (index === 'E') rating = 1700 + Math.floor(Math.random() * 500);
  else if (index === 'F') rating = 2000 + Math.floor(Math.random() * 500);
  else if (index === 'G') rating = 2300 + Math.floor(Math.random() * 400);
  else rating = 2500 + Math.floor(Math.random() * 300);
  
  // Common problem tags on Codeforces
  const allTags = [
    'implementation', 'math', 'greedy', 'dp', 'data structures', 'brute force',
    'constructive algorithms', 'graphs', 'sortings', 'binary search', 'dfs and similar',
    'trees', 'strings', 'number theory', 'combinatorics', 'geometry', 'bitmasks',
    'two pointers', 'shortest paths', 'probabilities', 'dsu', 'flows'
  ];
  
  // Select 1-4 random tags
  const tagCount = 1 + Math.floor(Math.random() * 3);
  const tags = [];
  for (let i = 0; i < tagCount; i++) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(tag)) tags.push(tag);
  }
  
  return {
    student: studentId,
    problemId: `${contestId}${index}`,
    contestId,
    index,
    name: `${theme} ${index}`,
    rating,
    tags,
    solvedDate,
    submissionId: Math.floor(Math.random() * 100000000) + 100000000,
    language: isPrerna ? 'C++' : randomLanguage()
  };
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Student.deleteMany({});
    await ContestData.deleteMany({});
    await ProblemData.deleteMany({});
    
    // Create default settings
    await Setting.findOneAndUpdate(
      { key: 'CODEFORCES_SYNC_TIME' },
      { key: 'CODEFORCES_SYNC_TIME', value: '0 2 * * *', description: 'Cron schedule for Codeforces data sync' },
      { upsert: true }
    );
    
    console.log('Previous data cleared. Starting to seed...');
    
    // Create students with Indian names
    const numStudents = Math.min(15, indianNames.length); // Use up to 15 names
    const studentPromises = [];
    
    for (let i = 0; i < numStudents; i++) {
      studentPromises.push(Student.create(createStudent(i)));
    }
    
    const students = await Promise.all(studentPromises);
    console.log(`Created ${students.length} students with Indian names`);
    
    // Create contest data for each student
    const contestPromises = [];
    
    students.forEach(student => {
      // Create more contests for Prerna, fewer for others
      const isPrerna = student.name === 'Prerna Sharma';
      const numContests = isPrerna ? 
        40 + Math.floor(Math.random() * 10) : // 40-49 contests for Prerna
        8 + Math.floor(Math.random() * 17);   // 8-24 contests for others
      
      // Space contests over the past 365 days with proper distribution
      // Ensure good coverage in recent time periods for filters
      if (isPrerna) {
        // For Prerna, create specific distribution to ensure data in all time ranges
        // Last 30 days - 10 contests
        for (let i = 0; i < 10; i++) {
          const daysAgo = Math.floor(Math.random() * 30);
          contestPromises.push(ContestData.create(createContestData(student._id, student.name, daysAgo)));
        }
        
        // 31-90 days - 15 contests
        for (let i = 0; i < 15; i++) {
          const daysAgo = 31 + Math.floor(Math.random() * 59);
          contestPromises.push(ContestData.create(createContestData(student._id, student.name, daysAgo)));
        }
        
        // 91-365 days - 15+ contests
        for (let i = 0; i < 15; i++) {
          const daysAgo = 91 + Math.floor(Math.random() * 274);
          contestPromises.push(ContestData.create(createContestData(student._id, student.name, daysAgo)));
        }
      } else {
        // For others, space throughout the year
        const daysPerContest = 365 / numContests;
        
        for (let i = 0; i < numContests; i++) {
          // Add some randomness to the contest spacing
          const daysAgo = Math.floor(i * daysPerContest + Math.random() * (daysPerContest * 0.8));
          if (daysAgo <= 365) {
            contestPromises.push(ContestData.create(createContestData(student._id, student.name, daysAgo)));
          }
        }
      }
    });
    
    await Promise.all(contestPromises);
    console.log(`Created contest data for students`);
    
    // Create problem data for each student
    const problemPromises = [];
    
    students.forEach(student => {
      const isPrerna = student.name === 'Prerna Sharma';
      
      // Create problem data with proper distribution for time filters
      if (isPrerna) {
        // For Prerna - create 650+ problems with specific distribution
        
        // Problems in the last 7 days (very active) - ~50 problems
        for (let i = 0; i < 50; i++) {
          const daysAgo = Math.floor(Math.random() * 7);
          problemPromises.push(ProblemData.create(createProblemData(student._id, student.name, daysAgo)));
        }
        
        // Problems in days 8-30 - ~100 problems
        for (let i = 0; i < 100; i++) {
          const daysAgo = 8 + Math.floor(Math.random() * 22);
          problemPromises.push(ProblemData.create(createProblemData(student._id, student.name, daysAgo)));
        }
        
        // Problems in days 31-90 - ~200 problems
        for (let i = 0; i < 200; i++) {
          const daysAgo = 31 + Math.floor(Math.random() * 59);
          problemPromises.push(ProblemData.create(createProblemData(student._id, student.name, daysAgo)));
        }
        
        // Problems in days 91-365 - ~300 problems
        for (let i = 0; i < 300; i++) {
          const daysAgo = 91 + Math.floor(Math.random() * 274);
          problemPromises.push(ProblemData.create(createProblemData(student._id, student.name, daysAgo)));
        }
      } else {
        // For others - normal distribution
        const problemBase = 50;
        const numProblems = problemBase + Math.floor(Math.random() * 100);
        
        // Distribute problems over time, more recent ones weighted more heavily
        for (let i = 0; i < numProblems; i++) {
          // Problems weighted towards more recent dates for active users
          let daysAgo;
          
          if (i < numProblems * 0.6) {
            // 60% of problems in the last 90 days
            daysAgo = Math.floor(Math.random() * 90);
          } else if (i < numProblems * 0.9) {
            // 30% of problems in the 91-180 day range
            daysAgo = 90 + Math.floor(Math.random() * 90);
          } else {
            // 10% of problems in the 181-365 day range
            daysAgo = 180 + Math.floor(Math.random() * 185);
          }
          
          problemPromises.push(ProblemData.create(createProblemData(student._id, student.name, daysAgo)));
        }
      }
    });
    
    await Promise.all(problemPromises);
    console.log(`Created problem data for students`);
    
    console.log('Seeding completed successfully');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run the seeding process
seedDatabase();