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
});


const shots = Object.freeze([
    { id: 'BH Drive', hand: 'Backhand', approach: '' },
    { id: 'FH Drive', hand: 'ForeHand', approach: '' },
    { id: 'BH X-Court', hand: 'Backhand', approach: '' },
    { id: 'FH X-Court', hand: 'ForeHand', approach: '' },
    { id: 'BH Boast', hand: 'Backhand', approach: '' },
    { id: 'FH Boast', hand: 'ForeHand', approach: '' },
    { id: 'BH Drop', hand: 'Backhand', approach: '' },
    { id: 'FH Drop', hand: 'ForeHand', approach: '' },
    { id: 'BH Volley Drop', hand: 'Backhand', approach: 'Volley' },
    { id: 'FH Volley Drop', hand: 'ForeHand', approach: 'Volley' },
    { id: 'BH Kill', hand: 'Backhand', approach: '' },
    { id: 'FH Kill', hand: 'ForeHand', approach: '' }
]);


const Annotation = model('Annotation', annotationSchema);


module.exports = {
    annotationSchema,
    Annotation,
    shots
}
