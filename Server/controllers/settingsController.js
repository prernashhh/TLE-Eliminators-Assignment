const Setting = require('../models/Setting');

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    
    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Get a specific setting by key
exports.getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ 
        success: false, 
        error: `Setting with key "${req.params.key}" not found` 
      });
    }
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Create or update a setting
exports.updateSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required'
      });
    }
    
    // Uses the static method from the Setting model
    const setting = await Setting.updateSetting(
      key, 
      value, 
      description,
      req.body.updatedBy || 'system'
    );
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Update cron job schedule
exports.updateCronSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    
    if (!schedule) {
      return res.status(400).json({
        success: false,
        error: 'Cron schedule is required'
      });
    }
    
    // Validate cron expression
    const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|[12][0-9]|3[01])|\*\/([1-9]|[12][0-9]|3[01])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
    
    if (!cronRegex.test(schedule)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cron schedule format'
      });
    }
    
    // Update the cron schedule setting
    const setting = await Setting.updateSetting(
      'CODEFORCES_SYNC_TIME',
      schedule,
      'Cron schedule for Codeforces data synchronization',
      req.body.updatedBy || 'system'
    );
    
    // Here you would need to restart the cron job with the new schedule
    // This would be implemented in utils/cron.js
    
    res.status(200).json({
      success: true,
      message: 'Cron schedule updated successfully',
      data: setting
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};