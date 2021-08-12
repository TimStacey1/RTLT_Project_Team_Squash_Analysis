const router = require('express').Router();

const Match = require('../models/Match');

const { validateMatchId } = require('./validators/matchValidators')

const { validateAnnotationId, validateAnnotation } = require('./validators/annotationValidators')

const validateRequest = require('./validators/validateRequest');

// route for creating a new annotation in a match
router.post('/:match_id/new',
    validateMatchId(),
    validateAnnotation(),
    validateRequest,
    (req, res, next) => {

  const matchId = req.params.match_id;
  const timestamp = req.body.timestamp;
  const playerNumber = req.body.playerNumber;
  const shot = req.body.shot;

  const annotation = {
    timestamp: timestamp,
    playerNumber: playerNumber,
    shot: shot
  };

  // find the match using the provided id and update its annotations
  Match.updateOne({ _id: matchId }, { $push: { annotations: annotation } })
  .then(res.status(200).json({
    message: 'New annotation added!'
  }))
  .catch(err => res.status(400).json('Error: ' + err));
});

// route for fetching annotations of an existing match
router.get('/:match_id/all',
    validateMatchId(),
    validateRequest,
    (req, res, next) => {

  const matchId = req.params.match_id;

  // find the match using the provided id and return its annotations
  Match.findOne({ _id: matchId })
  .then(match => match.annotations)
  .then(annotations => annotations.map(annotation => {
    return {
      id: annotation._id,
      timestamp: annotation.timestamp,
      playerNumber: annotation.playerNumber,
      shot: annotation.shot
    }
  }))
  .then(annotations => res.status(200).json(annotations))
  .catch(err => res.status(400).json('Error: ' + err));
});

// route for editing an existing annotation of a match
router.post('/:match_id/:annotation_id/edit',
    validateMatchId(),
    validateAnnotationId(),
    validateAnnotation(),
    validateRequest,
    (req, res, next) => {

  const matchId = req.params.match_id;
  const annotationId = req.params.annotation_id;

  const timestamp = req.body.timestamp;
  const playerNumber = req.body.playerNumber;
  const shot = req.body.shot;

  const updatedAnnotation = {
    _id: annotationId,
    timestamp: timestamp,
    playerNumber: playerNumber,
    shot: shot
  };

  // find the match using the provided id, find the annotation using
  // the annotation id and update its contents
  Match.updateOne(
    { _id: matchId, 'annotations._id': annotationId },
    { $set: { 'annotations.$': updatedAnnotation } }
  )
  .then(res.status(200).json('Annotation updated!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

// route for removing an existing annotation of a match
router.post('/:match_id/:annotation_id/remove',
    validateMatchId(),
    validateAnnotationId(),
    validateRequest,
    (req, res, next) => {

  const matchId = req.params.match_id;
  const annotationId = req.params.annotation_id;

  // find the match using the provided id, find the annotation using
  // the annotation id and discard it
  Match.updateOne(
    { _id: matchId },
    { $pull: { annotations: { _id: annotationId } } }
  )
  .then(res.status(200).json('Annotation removed!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
