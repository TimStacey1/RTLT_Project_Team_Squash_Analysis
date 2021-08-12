
const { Match } = require('../models/Match');

//TODO: Seperate model queries into seperate reusable functions 
//  - for both controllers and validators 

//TODO: Implement centralised error handling 
//  next(err) -> server.js errHandler function
//  custom errors 


//POST '/new'
const createNewMatch = (req, res, next) => {
	const newMatch = new Match({
		title: req.body.title,
		players: req.body.players,
		description: req.body.description,
		duration: req.body.duration
	});

	// save the new match in the db
	newMatch.save()
		.then(match => res.status(200).json({
			id: match.id
		}))
		.catch(err => res.status(400).json('Error: ' + err));
};


//GET '/all'
const getAllMatches = (req, res, next) => {
	// retrieve all annotations
	Match.find()
		.then(matches => matches.map(match => {
			return {
				id: match.id,
				title: match.title,
				players: {
					player1:
						[match.players.player1.firstName, match.players.player1.lastName].join(' '),
					player2:
						[match.players.player2.firstName, match.players.player2.lastName].join(' '),
				},
				description: match.description,
				duration: match.duration
			}
		}))
		.then(matches => res.status(200).json(matches))
		.catch(err => res.status(400).json('Error: ' + err));
};


//POST ''
const removeMatch = (req, res, next) => {
	res.send('NOT IMPLEMENTED: REMOVE MATCH');
};


//POST ''
const updateMatch = (req, res, next) => {
	res.send('NOT IMPLEMENTED: UPDATE MATCH');
};


module.exports = {
	createNewMatch,
	getAllMatches,
	removeMatch,
	updateMatch
};