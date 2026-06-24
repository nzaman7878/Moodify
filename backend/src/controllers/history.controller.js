const Timeline = require("../models/Timeline"); // ✅ Timeline, not History
const authUser = require("../middlewares/auth.middleware");
exports.logHistory = async (req, res) => {
  try {
    const { mood } = req.body;

    const newLog = await Timeline.create({
      mood,
      user: req.user.id,
      note: "",
    });

    console.log("✅ Saved to timelines:", newLog._id, "user:", newLog.user); // 🔍

    res.status(201).json({ success: true, log: newLog });
  } catch (error) {
    console.error("Error logging history:", error);
    res.status(500).json({ message: "Failed to log history." });
  }
};

exports.getHistory = async (req, res) => {
  try {
    // ✅ Only fetch this user's entries
    const historyLogs = await Timeline.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, history: historyLogs });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history." });
  }
};

const getWeeklyHistory = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // ✅ Only fetch this user's entries from last 7 days
    const history = await Timeline.find({
      user: req.user.id,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Error in getWeeklyHistory:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logHistory: exports.logHistory,
  getHistory: exports.getHistory,
  getWeeklyHistory,
};