const cron = require('node-cron');
const Student = require('../models/Student');
const Setting = require('../models/Setting');
const { syncStudentCodeforcesData } = require('./codeforcesAPI');
const { sendInactivityReminder } = require('./mailer');

// Store active jobs to be able to stop/restart them
const cronJobs = {};

// Initialize cron jobs
exports.initCronJobs = async () => {
  try {
    // Get cron schedule from settings or use default
    const cronSchedule = await Setting.getSetting(
      'CODEFORCES_SYNC_TIME', 
      '0 2 * * *'
    );
    
    // Schedule the sync job
    this.scheduleSyncJob(cronSchedule);
    
    console.log(`Cron job scheduled with: ${cronSchedule}`);
  } catch (error) {
    console.error('Failed to initialize cron jobs:', error);
  }
};

// Schedule the CF sync job with a specific cron pattern
exports.scheduleSyncJob = (cronPattern) => {
  // Stop existing job if any
  if (cronJobs.cfSync && cronJobs.cfSync.stop) {
    cronJobs.cfSync.stop();
  }
  
  // Create new job
  cronJobs.cfSync = cron.schedule(cronPattern, async () => {
    console.log('Running Codeforces sync job...');
    
    try {
      // Get all students
      const students = await Student.find();
      console.log(`Found ${students.length} students to sync`);
      
      // Process each student
      for (const student of students) {
        try {
          // Sync Codeforces data
          await syncStudentCodeforcesData(student);
          
          // Check for inactivity
          const now = new Date();
          const lastSubmission = student.lastSubmissionDate || new Date(0);
          const daysSinceLastSubmission = Math.floor((now - lastSubmission) / (1000 * 60 * 60 * 24));
          
          // If inactive for 7+ days and reminders are enabled, send email
          if (daysSinceLastSubmission >= 7 && student.emailRemindersEnabled) {
            console.log(`Student ${student.name} inactive for ${daysSinceLastSubmission} days. Sending reminder.`);
            
            // Send email
            const emailSent = await sendInactivityReminder(student);
            
            if (emailSent) {
              // Increment reminder count
              student.emailReminders += 1;
              await student.save();
            }
          }
        } catch (studentError) {
          console.error(`Error processing student ${student.name}:`, studentError);
        }
      }
      
      console.log('Codeforces sync job completed');
    } catch (error) {
      console.error('Error in sync job:', error);
    }
  });
};

// Function to update cron schedule
exports.updateCronSchedule = async (newSchedule) => {
  this.scheduleSyncJob(newSchedule);
  return true;
};