const { Schema } = require('mongoose');

const annotationSchema = new Schema({
  timestamp: {
    type: Number,
    required: true
  },
  playerNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 2,
  },
  movement: {
    type: String,
    required: true
  },
  components: {
    hand: String,
    approach: String,
    shot: String,
  }
})

module.exports = annotationSchema;
