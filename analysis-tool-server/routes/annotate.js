const router = require('express').Router();

const Match = require('../models/Match');

// route for creating a new annotation in a match
router.post('/:match_id/new', (req, res, next) => {
  const matchId = req.params.match_id;

  // TODO: validate match id

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

  const timestamp = req.body.timestamp;
  const playerNumber = req.body.playerNumber;
  const shot = req.body.shot;

  // TODO: validate all body properties

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
router.get('/:match_id/all', (req, res, next) => {
  const matchId = req.params.match_id;

  // TODO: validate match id

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

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
router.post('/:match_id/:annotation_id/edit', (req, res, next) => {
  const matchId = req.params.match_id;
  const annotationId = req.params.annotation_id;

  // TODO: validate match id and annotation id

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

  const timestamp = req.body.timestamp;
  const playerNumber = req.body.playerNumber;
  const shot = req.body.shot;

  // TODO: validate all body properties

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
router.post('/:match_id/:annotation_id/remove', (req, res, next) => {
  const matchId = req.params.match_id;
  const annotationId = req.params.annotation_id;

  // TODO: validate match id and annotation id

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

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
