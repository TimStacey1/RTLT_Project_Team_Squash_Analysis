const { Schema, model } = require('mongoose');

const { annotationSchema } = require('../models/Annotation');

const matchSchema = new Schema({
  title: {
    type: String,
    required: true
  },
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
  description: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
  courtBounds:{
    type: Object,
  },
  playerRGB: {
    type: Object,
  },
  annotations: [annotationSchema]
});

const Match = model('Match', matchSchema);

module.exports = {
  matchSchema,
  Match
};
