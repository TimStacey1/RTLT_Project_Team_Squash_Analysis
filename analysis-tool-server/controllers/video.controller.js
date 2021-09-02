const path = require('path');
const util = require('./util');
const fs = require("fs");

// upload video
const upload = async (req, res, next) => {
  const _path = path.join(__dirname + '../../videos/' + req.params.match_id + '.mp4');

  const [result, err] = await util.handleFileUpload(req.files.video, _path);

  if (err) return res.status(400).json(err.message);
};

// stream video
const stream = async (req, res, next) => {
  // ensure there is a range given for the video
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoPath = path.join(__dirname + '../../videos/' + req.params.match_id + '.mp4');

  // ensure that the video file exists
  fs.stat(videoPath, (err, stat) => {

    // file exists
    if (err == null) {
      const videoSize = fs.statSync(videoPath).size;

      // parse range
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, headers);

      const videoStream = fs.createReadStream(videoPath, { start, end });

      videoStream.pipe(res);
    } else if (err.code === 'ENOENT') {
      // file does not exist
      res.status(404).json('');
    } else {
      res.status(400).json(err.message);
    }
  });
};

module.exports = {
  upload,
  stream
};
