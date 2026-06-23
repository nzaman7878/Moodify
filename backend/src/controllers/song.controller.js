const Song = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

const moodFallbacks = {
  angry: ["angry", "surprised", "happy"],
  happy: ["happy", "neutral", "surprised"],
  neutral: ["neutral", "happy", "sad", "surprised"],
  sad: ["sad", "neutral", "happy"],
  surprised: ["surprised", "happy", "neutral"],
};

function normalizeMood(mood) {
  return String(mood || "neutral")
    .trim()
    .toLowerCase();
}

async function findSongForMood(mood) {
  const preferredMoods = moodFallbacks[mood] || moodFallbacks.neutral;

  for (const currentMood of preferredMoods) {
    const count = await Song.countDocuments({ mood: currentMood });

    if (!count) continue;

    const skip = Math.floor(Math.random() * count);
    const song = await Song.findOne({ mood: currentMood }).skip(skip);

    if (song) {
      return song;
    }
  }

  return Song.findOne().sort({ createdAt: -1 });
}

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Song file is required",
      });
    }

    const songBuffer = req.file.buffer;
    const mood = normalizeMood(req.body.mood);

    const tags = id3.read(songBuffer);

    if (!tags.title) {
      return res.status(400).json({
        message: "Song title metadata missing",
      });
    }

    if (!tags.image) {
      return res.status(400).json({
        message: "Song poster missing",
      });
    }

    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        filename: `${tags.title}.mp3`,
        folder: "/Nuruz/moodify/songs",
      }),

      storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: `${tags.title}.jpeg`,
        folder: "/Nuruz/moodify/posters",
      }),
    ]);

    const song = await Song.create({
      title: tags.title,
      url: songFile.url,
      posterUrl: posterFile.url,
      mood,
    });

    res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      song,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
async function getSong(req, res) {
  try {
    const mood = normalizeMood(req.query.mood);
    const song = await findSongForMood(mood);

    if (!song) {
      return res.status(404).json({
        message: "No song found for this mood",
      });
    }

    res.status(200).json({
      message: "Song fetched successfully",
      requestedMood: mood,
      song,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getRecommendations(req, res) {
  try {
    const mood = normalizeMood(req.query.mood);
    const preferredMoods = moodFallbacks[mood] || moodFallbacks.neutral;
    const limit = Math.min(Number(req.query.limit) || 10, 25);

    let songs = await Song.find({
      mood: { $in: preferredMoods },
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    if (songs.length < limit) {
      const remainingSongs = await Song.find({
        _id: { $nin: songs.map((song) => song._id) },
      })
        .sort({ createdAt: -1 })
        .limit(limit - songs.length);

      songs = [...songs, ...remainingSongs];
    }

    res.status(200).json({
      message: "Recommendations fetched successfully",
      requestedMood: mood,
      songs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  uploadSong,
  getSong,
  getRecommendations,
};
