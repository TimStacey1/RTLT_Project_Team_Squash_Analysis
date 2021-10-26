const path = require('path');
const fs = require('fs');
const util = require('./util');

const { Match } = require('../models/Match');

// create match
const create = async (req, res, next) => {
  const [result, err] = await util.handle(Match.create(req.body));

  if (err || !result) return res.status(400).json('Failed to create match.');

  return res.status(200).json({match_id: result._id});
};

// get match
const get = async (req, res, next) => {
  const [result, err] = await util.handle(Match.findById(req.params.match_id));

  if (err || !result) return res.status(400).json('Failed to get match.');

  const match = util.transformMatches([result])[0];

  return res.status(200).json(match);
};

// get all matches
const getAll = async (req, res, next) => {
  const [result, err] = await util.handle(Match.find());

  if (err || !result) return res.status(400).json('Failed to retrieve matches.');

  const matches = util.transformMatches(result);

  return res.status(200).json(matches);
};

// update match
const update = async (req, res, next) => {
  const [result, err] = await util.handle(Match.updateOne({ _id: req.params.match_id },
    {
      $set: {
        duration: req.body.duration,
        players: req.body.players
      }
    }
  ).setOptions({ omitUndefined: true }));

  if (err || result.nModified === 0) return res.status(400).json('Failed to update match.');

  return res.status(200).json('Successfully updated match.');
};

// remove match
const remove = async (req, res, next) => {
  let [result, err] = await util.handle(Match.deleteOne({ _id: req.params.match_id }));

  if (err || result.deletedCount === 0) return res.status(400).json('Failed to remove match.');

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
    [result, err] = await util.handleFileRemoval(videoFilePath);

    if (err) return res.status(400).json(err.message);

    return res.status(200).json('Successfully removed match.');
  } else {
    return res.status(200).json('Successfully removed match. Failed to remove match video.')
  }
};

module.exports = {
  create,
  get,
  getAll,
  update,
  remove
};
