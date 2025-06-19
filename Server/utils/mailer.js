const nodemailer = require('nodemailer');
require('dotenv').config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send inactivity reminder email
exports.sendInactivityReminder = async (student) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Reminder: Continue Your Codeforces Practice',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${student.name},</h2>
          <p>We noticed that you haven't solved any problems on Codeforces in the past 7 days.</p>
          <p>Regular practice is key to improving your programming skills. We encourage you to get back to solving problems!</p>
          <p>Your current stats:</p>
          <ul>
            <li>Current Rating: ${student.currentRating}</li>
            <li>Total Problems Solved: ${student.solvedProblems}</li>
            <li>Last Submission: ${student.lastSubmissionDate ? new Date(student.lastSubmissionDate).toLocaleDateString() : 'N/A'}</li>
          </ul>
          <p>Keep up the good work!</p>
          <p>Best regards,<br>TLE Eliminators Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            If you'd like to stop receiving these reminders, please contact your coach or update your preferences.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};