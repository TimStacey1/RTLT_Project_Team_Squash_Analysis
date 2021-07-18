const router = require('express').Router();

const Match = require('../models/Match');

// route for the creation of a new match
router.post('/new', function(req, res, next) {
  const players = req.body.players;
  const duration = req.body.duration;

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

  const newMatch = new Match({
    players: players,
    duration: duration
  });

  // save the new match in the db
  newMatch.save()
  .then((match) => res.status(200).json(match._id))
  .catch(err => res.status(400).json('Error: ' + err));
});

// route for updating annotations of an existing match
router.post('/:id/annotation', function(req, res, next) {
  const matchId = req.params.id;

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

  const annotation = req.body.annotation;

  // find the match using the provided id and update its annotations
  Match.updateOne({ _id: matchId }, { $push: { annotations: annotation } })
  .then(res.status(200).json('New annotation added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

// route for fetching annotations of an existing match
router.get('/:id/annotations', function(req, res, next) {
  const matchId = req.params.id;

  // add specific queries to be de-structured before the remaining queries
  // eg: { shot, ...remainingQueries}
  // const { ...remainingQueries } = req.params.query;

  // find the match using the provided id and return its annotations
  Match.findOne({ _id: matchId })
  .then(match => res.status(200).json(match.annotations))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
