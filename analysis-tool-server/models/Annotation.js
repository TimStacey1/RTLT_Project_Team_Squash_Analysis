const { Schema, model } = require('mongoose');

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
  shot: {
    id: {
      type: String,
      required: true
    },
    hand: {
      type: String,
      required: true
    },
    approach: {
      type: String,
      required: true
    }
  }
})

const Annotation = model('Annotation', annotationSchema);

module.exports = {
    annotationSchema,
    Annotation
}
