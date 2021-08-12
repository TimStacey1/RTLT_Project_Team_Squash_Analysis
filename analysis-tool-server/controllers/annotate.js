
const { Match } = require('../models/Match');


//TODO: Seperate model queries into seperate reusable functions 
//  - for both controllers and validators 

//TODO: Implement centralised error handling 
//  next(err) -> server.js errHandler function
//  custom errors 



//POST '/:match_id/new'
const createNewAnnotation = (req, res, next) => {
    const matchId = req.params.match_id;

    const annotation = {
        timestamp: req.body.timestamp,
        playerNumber: req.body.playerNumber,
        shot: req.body.shot
    };

    // find the match using the provided id and update its annotations
    Match.updateOne({ _id: matchId }, { $push: { annotations: annotation } })
        .then(res.status(200).json({
            message: 'New annotation added!'
        }))
        .catch(err => res.status(400).json('Error: ' + err));
};


//GET '/:match_id/all'
const getAllAnnotations = (req, res, next) => {
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
};


//POST '/:match_id/:annotation_id/edit'
const editAnnotation = (req, res, next) => {
    const matchId = req.params.match_id;

    const updatedAnnotation = {
        _id: req.params.annotation_id,
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
};


//POST '/:match_id/:annotation_id/remove'
const removeAnnotation = (req, res, next) => {
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
};


module.exports = {
    createNewAnnotation,
    getAllAnnotations,
    editAnnotation,
    removeAnnotation    
};