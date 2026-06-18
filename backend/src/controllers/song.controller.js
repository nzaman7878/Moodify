const Song = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Song file is required",
      });
    }

    const songBuffer = req.file.buffer;
    const { mood } = req.body;

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

module.exports = {
  uploadSong,
};