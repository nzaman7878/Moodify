const Timeline = require('../models/Timeline');
const mongoose = require('mongoose');

const updateTimelineNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    // 🔍 DEBUG — remove after fixing
    console.log("--- UPDATE NOTE DEBUG ---");
    console.log("ID from params:", id, "| length:", id.length);
    console.log("User from JWT:", req.user.id);
    console.log("ID valid?", mongoose.Types.ObjectId.isValid(id));

    // Find the doc WITHOUT the user filter first
    const rawEntry = await Timeline.findById(id);
    console.log("Raw entry found?", rawEntry ? "YES" : "NO");
    if (rawEntry) {
      console.log("Entry's user field:", rawEntry.user);
      console.log("Entry user type:", typeof rawEntry.user);
      console.log("JWT user type:", typeof req.user.id);
      console.log("Do they match?", rawEntry.user.toString() === req.user.id.toString());
    }
    // -------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const entry = await Timeline.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(id), 
        user: new mongoose.Types.ObjectId(req.user.id)  // ← cast both
      },
      { note },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ entry });
  } catch (error) {
    console.error("CRASH ERROR:", error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
module.exports = { updateTimelineNote };

