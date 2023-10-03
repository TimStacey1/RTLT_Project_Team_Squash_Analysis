const path = require('path');
const fs = require("fs");
const util = require('../lib/util');

// upload video
const upload = async (req, res, next) => {
  if (req.files && req.files.video) {
    const _path =
      path.join(
        `${__dirname}../../videos/${req.params.match_id}.${util.getVideoFileFormat(req.files.video.mimetype)}`
      );

    const [result, err] = await util.handleFileUpload(req.files.video, _path);

    if (err) return res.status(400).json(err.message);
  } else {
    res.status(400).json('No video file provided.');
  }
};

// stream video
const stream = async (req, res, next) => {
  // ensure there is a range given for the video
  const range = req.headers.range;

  if (!range) {
    res.status(400).send('Requires Range header');
  }

  const videoFileFormats = ['mp4', 'mov', 'avi'];

  const findVideoFile = async () => {
    for (let videoFileFormat of videoFileFormats) {
      let _path =
        path.join(
          `${__dirname}../../videos/${req.params.match_id}.${videoFileFormat}`
        );

      // ensure that the video file exists
      if (fs.existsSync(_path)) return _path;
    }

    return '';
  }

  const videoFilePath = await findVideoFile();

  if (videoFilePath !== '') {
    const videoSize = fs.statSync(videoFilePath).size;

    // parse range
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoFilePath, { start, end });

    videoStream.pipe(res);
  } else {
    res.status(404).json('');
  }
};

module.exports = {
  upload,
  stream
};
