const util = require('../lib/util');

const { spawnSync } = require('child_process');

const { Match } = require('../models/Match');
const { Annotation } = require('../models/Annotation');

const axios = require('axios').default;

// create annotation
// run the python before the setSelectedAnnotation and set two variables 
// takes in the player colours and timestamp
// the first being the shot position
// the second be the second player
// playerPos: shot taker's position
// opponentPos: opponent's position
// splitting the position is going to be scuffed
// it should be fine
// like idk um the output of the python has to be a print statement so i will need to split the string in javascript
// there is probably a better option but idk it is all i can think of. 
const create = async (req, res, next) => {
  const new_body = req.body;
  const [rst, error] = await util.handle(Match.findById(req.params.match_id));
  const python_test = spawnSync('python',['./controllers/Frame_function.py',req.body.timestamp, req.params.match_id, rst.courtBounds, rst.playerRGB, req.body.playerNumber]);
  const positions = python_test.stdout.toString().split(" ");
  console.log(python_test.stdout.toString());
  new_body['playerPos'] = parseInt(positions[0]);
  new_body['opponentPos'] = parseInt(positions[1]);
  console.log(python_test.stderr.toString());

  const _new = new Annotation(new_body);

  const [result, err] = await util.handle(Match.updateOne(
    { _id: req.params.match_id },
    { $push: { annotations: _new } })
  );

  if (err || result.nModified === 0) return res.status(400).json('Failed to create annotation.');

  return res.status(200).json({ annotation_id: _new._id });
};

// get annotation
const get = async (req, res, next) => {
  const [result, err] = await util.handle(Match.findById(
    { _id: req.params.match_id, 'annotations._id': req.params.annotation_id }
  ));

  if (err || !result) return res.status(400).json('Failed to get annotation.');

  const annotation = util.getAnnotation(result.annotations, req.params.annotation_id);
 
  return res.status(200).json(annotation);
};

// get all annotations
const getAll = async (req, res, next) => {
  const [result, err] = await util.handle(Match.findById(
    { _id: req.params.match_id }
  ));

  if (err || !result) return res.status(400).json('Failed to get annotations.');

  const annotations = util.transformAnnotations(result.annotations);
  console.log(annotations);
  return res.status(200).json(annotations);
};

// edit annotation
const edit = async (req, res, next) => {
  const [result, err] = await util.handle(Match.updateOne(
    { _id: req.params.match_id, 'annotations._id': req.params.annotation_id },
    {
      $set: {
        'annotations.$.timestamp': req.body.timestamp,
        'annotations.$.playerNumber': req.body.playerNumber,
        'annotations.$.components': req.body.components
      }
    }
  ).setOptions({ omitUndefined: true }));

  if (err || result.nModified === 0) return res.status(400).json('Failed to update annotation.');

  return res.status(200).json('Successfully updated annotation.');
};

// remove annotation
const remove = async (req, res, next) => {
  const [result, err] = await util.handle(Match.updateOne(
    { _id: req.params.match_id },
    { $pull: { annotations: { _id: req.params.annotation_id } } }
  ));

  if (err || result.nModified === 0) return res.status(400).json('Failed to remove annotation.');

  return res.status(200).json('Successfully removed annotation.');
};

module.exports = {
  create,
  get,
  getAll,
  edit,
  remove
};
