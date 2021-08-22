

const { Match } = require('../models/Match');

const util = require('./util');


//POST '/new'
const create = async (req, res, next) => {	
	const [result, err] = await util.handle(Match.create(req.body));

	if (err || !result) return res.status(400).json('Failed to create match.');

	return res.status(200).json(result._id);
};


//POST '/get'
const get = async (req, res, next) => {
	const [result, err] = await util.handle(Match.findById(req.params.match_id));

	if (err || !result) return res.status(400).json('Failed to get match.');	

	const match = util.transformMatches([result])[0]; 

	return res.status(200).json(match);
};


//GET '/all'
const getAll = async (req, res, next) => {

	const [result, err] = await util.handle(Match.find());

	if (err || !result) return res.status(400).json('Failed to retrieve matches.');

	const matches = util.transformMatches(result); 

	return res.status(200).json(matches);
};


//POST '/remove'
const remove = async (req, res, next) => {
	const [result, err] = await util.handle(Match.deleteOne({ _id: req.params.match_id }));

	if (err || result.deletedCount === 0) return res.status(400).json('Failed to remove match.');

	return res.status(200).json('Successfully removed the match.');
};


//POST '/update'
const update = async (req, res, next) => {
	const [result, err] = await util.handle(Match.updateOne({ _id: req.params.match_id },		
		{
			$set: {
				duration: req.params.duration,
				players: req.body.players
            }
		}
	).setOptions({ omitUndefined: true }));

	if (err || result.nModified === 0) return res.status(400).json('Failed to update match.');

	return res.status(200).json('Successfully updated the match.');
};


module.exports = {
	create,
	get,
	getAll,
	remove,
	update	
};