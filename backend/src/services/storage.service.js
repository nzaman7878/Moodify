const ImageKit = require("@imagekit/nodejs").default;

let client;

function getClient() {
  if (client) return client;

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error(
      "IMAGEKIT_PRIVATE_KEY is missing. Add it to backend/.env before uploading songs."
    );
  }

  client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  });

  return client;
}

async function uploadFile({ buffer, filename, folder = "" }) {
  const file = await getClient().files.upload({
    file: await ImageKit.toFile(Buffer.from(buffer)),
    fileName: filename,
    folder,
  });

  return file;
}

module.exports = { uploadFile };
