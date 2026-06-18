const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    posterUrl: {
      type: String,
      required: true,
    },

    mood: {
      type: String,
      enum: {
        values: ["sad", "happy", "surprised"],
        message: "Mood must be sad, happy or surprised",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema);

module.exports = Song;