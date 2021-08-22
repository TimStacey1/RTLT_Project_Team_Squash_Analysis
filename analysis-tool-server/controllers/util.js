

const handle = (promise) => {
	return promise
		.then(result => ([result, undefined]))
		.catch(error => Promise.resolve([undefined, error]));
}


const transformMatches = (matches) => {
	return matches.map(match => {
		return {
			id: match._id,
			title: match.title,
			players: {
				player1: [match.players.player1.firstName, match.players.player1.lastName].join(' '),
				player2: [match.players.player2.firstName, match.players.player2.lastName].join(' '),
			},
			description: match.description,
			duration: match.duration
		};		
	});
};


const tranformAnnotations = (annotaions) => {
	return annotaions.map(annotation => {
		return {
			id: annotation._id,
			timestamp: annotation.timestamp,
			playerNumber: annotation.playerNumber,
			shot: annotation.shot
		};
	});
};
 

module.exports = {
	handle,
	transformMatches,
	tranformAnnotations
};