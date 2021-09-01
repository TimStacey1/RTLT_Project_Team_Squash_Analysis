const path = require('path');
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
        duration: req.params.duration,
        players: req.body.players
      }
    }
  ).setOptions({ omitUndefined: true }));

  if (err || result.nModified === 0) return res.status(400).json('Failed to update match.');

  return res.status(200).json('Successfully updated the match.');
};

// remove match
const remove = async (req, res, next) => {
  let [result, err] = await util.handle(Match.deleteOne({ _id: req.params.match_id }));

  if (err || result.deletedCount === 0) return res.status(400).json('Failed to remove match.');

  const _path = path.join(__dirname + '../videos/' + req.params.match_id);

  [result, err] = await util.handleFileRemoval(_path);

  if (err) return res.status(400).json(err.message);

  return res.status(200).json('Successfully removed the match.');
};

module.exports = {
  create,
  get,
  getAll,
  update,
  remove
};
