
export class game {

    //Setup
    constructor(_gameAnnotations) {
        this.gameAnnotations = _gameAnnotations;

        this.player1Points = _gameAnnotations.filter((annotation) =>
            (annotation.components.type === 'score') && (annotation.playerNumber === 1)).length;

        this.player2Points = _gameAnnotations.filter((annotation) =>
            (annotation.components.type === 'score') && (annotation.playerNumber === 2)).length;

        this.winner = this.getWinner();
        this.shotWin = this.getImmediateAnnotation(_gameAnnotations, 'win');
        this.shotError = this.getImmediateAnnotation(_gameAnnotations, 'error');
    }

    getWinner() {
        let winner;
        if (this.player1Points > this.player2Points) {
            winner = 1;
        } else {
            winner = 2;
        }

        return winner;
    }

    getImmediateAnnotation(gameAnnotations, type) {

        //need to get the shotCount for the annotations prior to a point won
        gameAnnotations.sort((a, b) => a.timestamp - b.timestamp);
        let pointAnnotations = [];
        let pointPlayer = [];
        let shotsBeforePoint = [];
        let beforePointPlayer = [];
        let indexOfPoints = [];
        gameAnnotations.forEach((annotation) => {
            if (annotation.components.type === 'score') {
                pointAnnotations.push(annotation);
                pointPlayer.push(annotation.playerNumber);
                indexOfPoints.push(gameAnnotations.indexOf(annotation));
            }
        })

        for (let i = 0; i < indexOfPoints.length; i++) {
            gameAnnotations.forEach((annotation) => {
                if (gameAnnotations.indexOf(annotation)
                    === (indexOfPoints[i] - 1)) {
                    shotsBeforePoint.push(annotation);
                    beforePointPlayer.push(annotation.playerNumber);
                }
            })
        }

        let shotWin = [];
        let shotError = [];

        for (let i = 0; i < pointPlayer.length; i++) {
            if (pointPlayer[i] === beforePointPlayer[i]) {
                shotWin.push(shotsBeforePoint[i]);
            } else {
                shotError.push(shotsBeforePoint[i]);
            }
        }

        if (type === 'win') {
            return shotWin;
        } else {
            return shotError;
        }
    }
};

export class gameSession {

    //Setup
    constructor(_match) {
        this.title = _match.title;
        this.player1 = _match.players.player1;
        this.player2 = _match.players.player2;
        this.numGames = this.getNumGames(_match);
        this.games = this.getGameData(_match.annotations);
    }

    getNumGames(_match) {
        let count = _match.annotations.filter((annotation) => annotation.components.type === 'game').length + 1;
        return count;
    }

    getGameData(annotations) {
        let gamesData = [];

        let newGameAnnotations = annotations.filter((annotation) => annotation.components.type === 'game')
            .map((annotation) => annotation.timestamp);

        let gameShotAnnotations = [];
        
        // Find all annotations within each game & assign to store
        for (let i = 0; i < newGameAnnotations.length + 1; i++) {
            if (i === 0) {
                if (newGameAnnotations.length === 0) {
                    gameShotAnnotations[i] = annotations;
                } else {
                    gameShotAnnotations[i] = annotations
                        .filter((annotation) => (annotation.timestamp < newGameAnnotations[0]));
                }
            } else if (i === newGameAnnotations.length) {
                gameShotAnnotations[i] = annotations
                    .filter(
                        (annotation) => (annotation.timestamp > newGameAnnotations[newGameAnnotations.length - 1])
                    )
            } else {
                gameShotAnnotations[i] = annotations
                    .filter(
                        (annotation) => ((annotation.timestamp > newGameAnnotations[i - 1]) &
                                (annotation.timestamp < newGameAnnotations[i]))
                    )
            }
        }

        for (var i = 0; i < gameShotAnnotations.length; i++) {
            let tempGame = new game(gameShotAnnotations[i]);
            gamesData.push(tempGame);
        }

        return gamesData;
    }
};