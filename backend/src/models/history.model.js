const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      required: true,
      lowercase: true,
    },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);