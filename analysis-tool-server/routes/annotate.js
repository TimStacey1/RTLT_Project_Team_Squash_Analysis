const router = require('express').Router();

const Match = require('../models/Match');

// route for creating a new annotation in a match
router.post('/:id/new', (req, res, next) => {
  const matchId = req.params.id;

  // TODO: validate match id

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

  const timestamp = req.body.timestamp;
  const playerNumber = req.body.timestamp;
  const movement = req.body.movement;
  const components = req.body.components;

  // TODO: validate all body properties

  const annotation = {
    timestamp: timestamp,
    playerNumber: playerNumber,
    movement: movement,
    components: components
  };

  // find the match using the provided id and update its annotations
  Match.updateOne({ _id: matchId }, { $push: { annotations: annotation } })
  .then(res.status(200).json({
    message: 'New annotation added!'
  }))
  .catch(err => res.status(400).json('Error: ' + err));
});

// route for fetching annotations of an existing match
router.get('/:id/all', (req, res, next) => {
  const matchId = req.params.id;

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
      movement: annotation.movement,
      components: annotation.components
    }
  }))
  .then(annotations => res.status(200).json(annotations))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
