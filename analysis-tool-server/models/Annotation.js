const { Schema, model } = require('mongoose');

const annotationSchema = new Schema({
  timestamp: {
    type: Number,
    required: true
  },
  playerNumber: {
    type: Number,
    min: 1,
    max: 2,
  },
  playerPos:{
    type: Number
  },
  opponentPos:{
    type: Number
  },
  components: {
    type: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    hand: {
      type: String
    },
    approach: {
      type: String
    }
  }
});

const annotationComponents = [
  { type: 'shot', id: 'BH Drive', hand: 'Backhand' },
  { type: 'shot', id: 'FH Drive', hand: 'ForeHand' },
  { type: 'shot', id: 'BH X-Court', hand: 'Backhand' },
  { type: 'shot', id: 'FH X-Court', hand: 'ForeHand' },
  { type: 'shot', id: 'BH Boast', hand: 'Backhand' },
  { type: 'shot', id: 'FH Boast', hand: 'ForeHand' },
  { type: 'shot', id: 'BH Drop', hand: 'Backhand' },
  { type: 'shot', id: 'FH Drop', hand: 'ForeHand' },
  { type: 'shot', id: 'BH Volley Drop', hand: 'Backhand', approach: 'Volley' },
  { type: 'shot', id: 'FH Volley Drop', hand: 'ForeHand', approach: 'Volley' },
  { type: 'shot', id: 'BH Kill', hand: 'Backhand' },
  { type: 'shot', id: 'FH Kill', hand: 'ForeHand' },
  { type: 'game', id: 'New Game' },
  { type: 'rally', id: 'New Rally' },
  { type: 'score', id: 'Point Won'},
];

const Annotation = model('Annotation', annotationSchema);

module.exports = {
  annotationSchema,
  Annotation,
  annotationComponents
};
