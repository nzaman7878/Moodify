const History = require("../models/history.model");


exports.logHistory = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const newLog = await History.create({ mood });

    res.status(201).json({ success: true, log: newLog });
  } catch (error) {
    console.error("Error logging history:", error);
    res.status(500).json({ message: "Failed to log history." });
  }
};


exports.getHistory = async (req, res) => {
  try {
 
    const historyLogs = await History.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({ success: true, history: historyLogs });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history." });
  }
};

module.exports = {
  logHistory: exports.logHistory,
  getHistory: exports.getHistory,
};