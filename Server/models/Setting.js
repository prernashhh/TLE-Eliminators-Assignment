const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
}, {
  timestamps: true,
});

// Define static method to get a setting with fallback
SettingSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Define static method to set/update a setting
SettingSchema.statics.updateSetting = async function(key, value, description = null, updatedBy = 'system') {
  return this.findOneAndUpdate(
    { key },
    { 
      value,
      description: description || `Setting for ${key}`,
      lastUpdated: new Date(),
      updatedBy
    },
    { 
      new: true, 
      upsert: true, 
      setDefaultsOnInsert: true
    }
  );
};

module.exports = mongoose.model('Setting', SettingSchema);