const { tryParseJson } = require("../config/helper");
const newSettingModel = require("../models/NewSettingModel");

async function GetSetting() {
  const v2setting = await newSettingModel.find({ status: "Enabled" });
  const result = {};
  for (const iterator of v2setting) {
    result[iterator.name] = iterator.value;
  }
  return result;
}

async function GetSettingByName(name) {
  return await newSettingModel.findOne({ status: "Enabled", name: name }).select("value");
}

async function SettingValue(name) {
  try {
    const setting = await newSettingModel
      .findOne({ status: "Enabled", name: name })
      .select("value");
    return tryParseJson(setting.value);
  } catch (err) {
    console.log(err)
    return null;
  }
}

module.exports = {
  GetSetting,
  GetSettingByName,
  SettingValue,
};
