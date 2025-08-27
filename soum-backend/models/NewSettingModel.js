const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  name: { type: String },
  description: { type: String },
  type: {
    type: String,
    enum: ["number", "string", "boolean", "option", "json"],
  },
  setting_category: { type: String },
  value: { type: Schema.Types.Mixed, default: "" },
  possible_values: { type: Schema.Types.Mixed, default: "" },
  status: { type: String, default: "Enabled" },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

const Setting = mongoose.model("Setting", settingSchema, "Setting");
module.exports = Setting