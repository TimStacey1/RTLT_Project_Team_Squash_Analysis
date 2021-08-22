

const { Match } = require('../models/Match');

const { Annotation } = require('../models/Annotation');

const util = require('./util');


//POST '/:match_id/new'
const create = async (req, res, next) => {
    const _new = new Annotation(req.body); 

    const [result, err] = await util.handle(Match.updateOne(       
        { _id: req.params.match_id },
        { $push: { annotations: _new } })
    );            

    if (err || result.nModified === 0) return res.status(400).json('Failed to create annotation.');

    return res.status(200).json(_new._id);
};


//POST '/get'
const get = async (req, res, next) => {
    const [result, err] = await util.handle(Match.findById(        
        { _id: req.params.match_id, annotations: { _id: req.params.annotation_id } }
    ));    

    if (err || !result) return res.status(400).json('Failed to get annotation.');

    const annotation = util.transformAnnotations([result])[0]; 

    return res.status(200).json(annotation);
};


//GET '/:match_id/all'
const getAll = async (req, res, next) => {
    const [result, err] = await util.handle(Match.findById(
        { _id: req.params.match_id, annotations: { _id: req.params.annotation_id } }
    ));                

    if (err || !result) return res.status(400).json('Failed to get annotations.');

    const annotations = util.tranformAnnotations(result.annotations);

    return res.status(200).json(annotations);
};


//POST '/:match_id/:annotation_id/edit'
const edit = async (req, res, next) => {
    const [result, err] = await util.handle(Match.updateOne(        
        { _id: req.params.match_id, 'annotations._id': req.params.annotation_id },
        {
            $set: {
                'annotations.$.timestamp': req.body.timestamp,
                'annotations.$.playerNumber': req.body.playerNumber,
                'annotations.$.shot': req.body.shot
            }
        }
    ).setOptions({ omitUndefined: true }));

    if (err || result.nModified === 0) return res.status(400).json('Failed to update annotation.');

    return res.status(200).json('Successfully updated the annotation.');  
};


//POST '/:match_id/:annotation_id/remove'
const remove = async (req, res, next) => {
    const [result, err] = await util.handle(Match.updateOne(        
        { _id: req.params.match_id },
        { $pull: { annotations: { _id: req.params.annotation_id } } }
    ));

    if (err || result.nModified === 0) return res.status(400).json('Failed to remove annotation.');

    return res.status(200).json('Successfully removed the annotation.');
};


module.exports = {
    create,
    getAll,
    get,
    edit,   
    remove    
};