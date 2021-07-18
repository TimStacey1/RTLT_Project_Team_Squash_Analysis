const { Schema, model } = require('mongoose');

const annotationSchema = require('../models/Annotation');

const matchSchema = new Schema({
  players: {
    player1: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      }
    },
    player2: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      }
    }
  },
  duration: {
    type: Number,
    required: true
  },
  annotations: [annotationSchema]
});

const Match = model('Match', matchSchema);

module.exports = Match;
