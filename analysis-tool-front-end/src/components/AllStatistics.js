import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';

import { gameSession } from './GameSessionClass';
//import { Player } from 'video-react';

export default function AllStatistics(props) {
    const { baseUrl } = props;
    const [matches, setMatches] = useState([]);

    //const [annotations, setAnnotations] = useState([]);
    useEffect(() => {
        axios
            .get(baseUrl + '/match/all')
            .then((res) => res.data)
            .then((matches) => setMatches(matches.reverse()));
    }, [baseUrl]);

    // Filtered Matches
    const [filterMatches, setFilterMatches] = useState([]);
    //const playerNums = [1, 2];
    const [filterLength, setFilterLength] = useState(false);

    const backgroundColors = [
        'rgb(0, 111, 58)',
        'rgb(255, 193, 7)',
        'rgb(27, 131, 190)',
        'rgb(128, 128, 128)',
        'rgb(255, 43, 43)',
        'rgb(189, 93, 56)',
        'rgb(254, 170, 169)',
        'rgb(175, 195, 255))',
        'rgb(13, 32, 47)',
        'rgb(229, 226, 209)',
        'rgb(193, 61, 229)',
        'rgb(186, 252, 193)',
    ];

    // Collate unique player names

    let player1 = matches.map((match) => match.players.player1);
    let player2 = matches.map((match) => match.players.player2);
    let players = player1.concat(player2);

    let uniquePlayers = [];
    players.forEach(player => {
        if (!uniquePlayers.includes(player)) {
            uniquePlayers.push(player);
        }
    });

    let gameTitles = matches.map((match) => match.title);

    // Get unique shot types
    let uniqueShots = [];
    //Get unique shots from every match and concat them into one array
    matches.forEach((match) => {
        uniqueShots = uniqueShots.concat([
            ...new Set(
                match.annotations
                    .filter((annotation) => annotation.components.type === 'shot')
                    .map((annotation) => annotation.components.id)
            )
        ]);
    });
    // From the final array get the unique shots overall
    uniqueShots = [...new Set(uniqueShots)];

    // Create filter for player positions
    const gameZoneLabels = ['Front Left', 'Front Right', 'Back Left', 'Back Right', 'T-Zone'];

    const [tempUseState, setTempUseState] = useState(false);
    const [filterStatus, setFilterStatus] = useState(new Array(1).fill(false));

    const setLengthOfFilters = () => {
        let neededFilterLength = gameTitles.length + uniqueShots.length + gameZoneLabels.length
            + uniquePlayers.length + uniquePlayers.length;
        while (filterStatus.length < neededFilterLength) {
            setFilterStatus(filterStatus.push(tempUseState));
        }
    }

    let matchDataBreakdown = [];
    // Has all the data broken down to a individual game level
    matches.forEach((match) => {
        let tempMatchBreakdown = new gameSession(match);
        matchDataBreakdown.push(tempMatchBreakdown);
    })

    // Get all annotations function

    function getAllAnnotations(filteredMatches) {
        let allAnnotations = [];
        filteredMatches.forEach((match) => {
            let matchAnnotations = [];
            match.games.forEach((game) => {
                let gameAnnotations = [];
                game.gameAnnotations.forEach((annotation) => {
                    if (annotation.components.type === 'shot') {
                        gameAnnotations.push(annotation);
                    }
                })
                matchAnnotations = matchAnnotations.concat(gameAnnotations);
            })
            allAnnotations = allAnnotations.concat(matchAnnotations);
        })

        return allAnnotations;
    }

    // SHOT COUNT GRAPH DATA
    let shotCount = Array(uniqueShots.length).fill(0);

    function getShotCount(annotations, shottypeID) {
        let shotCount = annotations.filter((item) =>
            item.components.id === shottypeID).length;

        return shotCount;
    }

    for (var i = 0; i < uniqueShots.length; i++) {
        for (let x = 0; x < filterMatches.length; x++) {
            for (let z = 0; z < filterMatches[x].games.length; z++) {
                shotCount[i] = shotCount[i] + getShotCount(filterMatches[x].games[z].gameAnnotations, uniqueShots[i]);
            }
        }
    }

    const shotCountChart = {
        labels: uniqueShots,
        datasets: [
            {
                label: 'No. of Shots',
                borderColor: '#ffffff',
                borderWidth: 0,
                data: shotCount,
                backgroundColor: backgroundColors,
            },
        ],
        title: 'Shot Count',
    };


    // HAND COUNT GRAPH DATA

    function getHandCount(annotations, handLabel) {
        let handCount = annotations.filter((item) =>
            item.components.id.includes(handLabel)).length;

        return handCount;
    }

    const handLabels = ['BH', 'FH'];
    let handCount = [0, 0];
    for (let i = 0; i < handCount.length; i++) {
        for (let x = 0; x < filterMatches.length; x++) {
            for (let z = 0; z < filterMatches[x].games.length; z++) {
                handCount[i] = handCount[i] + getHandCount(filterMatches[x].games[z].gameAnnotations, handLabels[i]);
            }
        }
    }

    const handCountChart = {
        labels: ['Backhand Shots', 'Forehand Shots'],
        datasets: [
            {
                label: 'No. of Shots',
                borderColor: '#ffffff',
                borderWidth: 5,
                data: handCount,
                backgroundColor: backgroundColors,
            },
        ],
        title: 'Backhand vs Forehand',
    };

    // PLAYERS SHOT COUNT GRAPH DATA

    function getPlayerCount(annotations, playerNum) {
        let playerCount = annotations.filter((item) => (item.playerNumber === playerNum
            ) && item.components.type === 'shot').length;
        return playerCount;
    }

    let playerShotCount = Array(uniquePlayers.length).fill(0);
    for (let i = 0; i < playerShotCount.length; i++) {

        let filteredMatches = filterMatches.filter((match) => (match.player1 === uniquePlayers[i])
            || (match.player2 === uniquePlayers[i]));
                
        for (let x = 0; x < filteredMatches.length; x++) {

            let filteredPlayers = 0;
            if (filteredMatches[x].player1 === uniquePlayers[i]) {
                filteredPlayers = 1;
            } else {
                filteredPlayers = 2;
            }

            for (let z = 0; z < filteredMatches[x].games.length; z++) {
                playerShotCount[i] = playerShotCount[i] +
                    getPlayerCount(filteredMatches[x].games[z].gameAnnotations, filteredPlayers);
            }
        }
    }

    const playerShotsCountChart = {
        labels: uniquePlayers,
        datasets: [
            {
                label: 'No. of Shots',
                borderColor: '#ffffff',
                borderWidth: 5,
                data: playerShotCount,
                backgroundColor: backgroundColors,
            },
        ],
        title: 'All Players',
    };

    //POINT WIN AND ERROR BY GRAPH DATA

    //need to get the shotCount for the annotations prior to a point won
    filterMatches.forEach((match) => {
        match.games.forEach((game) => {
            game.gameAnnotations.sort((a, b) => a.timestamp - b.timestamp);
        })
    
    })

    let shotWin = [];
    let shotError = [];

    filterMatches.forEach((match) => {
        let matchShotWin = [];
        let matchShotError = [];

        match.games.forEach((game) => {
            let gameShotWin = [];
            let gameShotError = [];

            game.shotWin.forEach((annotation) => {
                gameShotWin.push(annotation);
            })

            game.shotError.forEach((annotation) => {
                gameShotError.push(annotation);
            })
            matchShotWin = matchShotWin.concat(gameShotWin);
            matchShotError = matchShotError.concat(gameShotError);

        })
        shotWin = shotWin.concat(matchShotWin);
        shotError = shotError.concat(matchShotError);
    })

    let shotWinCount = [];
    let shotErrorCount = [];

    for (let i = 0; i < uniqueShots.length; i++) {
        shotWinCount[i] = getShotCount(shotWin, uniqueShots[i]);
        shotErrorCount[i] = getShotCount(shotError, uniqueShots[i]);
    }

    const shotWinCountChart = {
        labels: uniqueShots,
        datasets: [
            {
                label: 'No. of Shots',
                borderColor: '#ffffff',
                borderWidth: 5,
                data: shotWinCount,
                backgroundColor: backgroundColors,
            },
        ],
        title: 'Point Win By Shot Type',
    };

    const shotErrorCountChart = {
        labels: uniqueShots,
        datasets: [
            {
                label: 'No. of Shots',
                borderColor: '#ffffff',
                borderWidth: 5,
                data: shotErrorCount,
                backgroundColor: backgroundColors,
            },
        ],
        title: 'Error By Shot Type',
    };

    // SHOT TYPE PER MATCH GRAPH DATA

    let allMatchAnnotations = [];
    let labelData = [];

    filterMatches.forEach((match) => {
        let matchAnnotations = [];
        labelData.push(match.title);
        match.games.forEach((game) => {
            let gameAnnotations = [];
            game.gameAnnotations.forEach((annotation) => {
                if (annotation.components.type === 'shot') {
                    gameAnnotations.push(annotation);
                }
            })
            matchAnnotations = matchAnnotations.concat(gameAnnotations);
        })
        allMatchAnnotations.push(matchAnnotations);
    })
    
    let temp = [];
    // Create array full of the number of occurences in each shot
    for (let i = 0; i < allMatchAnnotations.length; i++) {
        for (let k = 0; k < uniqueShots.length; k++) {
            temp.push(getShotCount(allMatchAnnotations[i], uniqueShots[k]));
        }
    }

    let gameData = [];
    let fullGamesDataset = [];
    // Rearrange array so it can be passed into chartjs, puts all the shot occurrences for each shot across all games
    for (let k = 0; k < uniqueShots.length; k++) {
        let temp2 = [];
        for (let i = 0; i < filterMatches.length + 1; i++) {
            temp2.push(temp[k + i * uniqueShots.length]);
        }
        gameData.push(temp2);
        // Create datasets for each shot type, label them as the shot id
        let data = {
            label: uniqueShots[k],
            data: gameData[k],
            backgroundColor: backgroundColors[k],
            borderWidth: 0,
        };
        fullGamesDataset.push(data);
    }

    //THIS IS FOR THE SHOT TYPE PER OPPONENT POSITION GRAPH

    // Find the unique opponent positions
    let uniqueOppoLoc = [];

    filterMatches.forEach((match) => {
        match.games.forEach((game) => {
            game.gameAnnotations.forEach((annotation) => {
                if (!uniqueOppoLoc.includes(annotation.opponentPos)) {
                    uniqueOppoLoc.push(annotation.opponentPos);
                }
            })
        })
    })

    // Get all annotations into one array

    let oneAllMatchAnnotations = [];
    filterMatches.forEach((match) => {
        let matchAnnotations = [];
        match.games.forEach((game) => {
            let gameAnnotations = [];
            game.gameAnnotations.forEach((annotation) => {
                if (annotation.components.type === 'shot') {
                    gameAnnotations.push(annotation);
                }
            })
            matchAnnotations = matchAnnotations.concat(gameAnnotations);
        })
        oneAllMatchAnnotations = oneAllMatchAnnotations.concat(matchAnnotations);
    })

    // Find all shots made with each opponent position and create labels
    let opponentPositionData = [];
    let opponentPositionLabels = [];
    for (let i = 0; i < uniqueOppoLoc.length; i++) {

        opponentPositionData[i] = oneAllMatchAnnotations
            .filter((annotation) => (annotation.opponentPos === uniqueOppoLoc[i])
                & annotation.components.type === 'shot');

        if (uniqueOppoLoc[i] === 1) {
            opponentPositionLabels.push(gameZoneLabels[0]);
        } else if (uniqueOppoLoc[i] === 2) {
            opponentPositionLabels.push(gameZoneLabels[1]);
        } else if (uniqueOppoLoc[i] === 3) {
            opponentPositionLabels.push(gameZoneLabels[2]);
        } else if (uniqueOppoLoc[i] === 4) {
            opponentPositionLabels.push(gameZoneLabels[3]);
        } else if (uniqueOppoLoc[i] === 5) {
            opponentPositionLabels.push(gameZoneLabels[4]);
        }
    }

    let positionData = [];
    temp = [];
    let fullOpponentPositionDataset = [];

    // Create array full of the number of occurences in each shot
    for (let i = 0; i < uniqueOppoLoc.length; i++) {
        for (let k = 0; k < uniqueShots.length; k++) {
            temp.push(getShotCount(opponentPositionData[i], uniqueShots[k]));
        }
    }
    // Rearrange array so it can be passed into chartjs, puts all the shot occurrences for each shot across all games
    for (let k = 0; k < uniqueShots.length; k++) {
        let temp2 = [];
        for (let i = 0; i < uniqueOppoLoc.length; i++) {
            temp2.push(temp[k + (i * uniqueShots.length)]);
        }
        positionData.push(temp2);
        
        // Create datasets for each shot type, label them as the shot id
        let data = {
            label: uniqueShots[k],
            data: positionData[k],
            backgroundColor: backgroundColors[k],
            borderWidth: 0,
        };
        fullOpponentPositionDataset.push(data);
    }

    // HEAT MAP GRAPH FUNCTION
    function drawHeatMap(allAnnotations) {

        var sortedHeatMapData = [gameZoneLabels.length];
        for (let i = 0; i < gameZoneLabels.length; i++) {
            sortedHeatMapData[i] = allAnnotations.filter(((annotation) => annotation.playerPos === (i + 1))).length
                + allAnnotations.filter(((annotation) => annotation.opponentPos === (i + 1))).length;
        }

        var heatMapOpacity = [];
        for (let i = 0; i < sortedHeatMapData.length; i++) {
            heatMapOpacity.push(sortedHeatMapData[i] / Math.max(...sortedHeatMapData));
        }

        const canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            const ctx = canvas.getContext("2d");

            //Black background
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 350);
            ctx.lineTo(350, 350);
            ctx.lineTo(350, 0);
            ctx.closePath();
            ctx.fill();

            //Front Left
            ctx.fillStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.moveTo(2, 2);
            ctx.lineTo(2, 199);
            ctx.lineTo(149, 199);
            ctx.lineTo(149, 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgba(0,131,63," + heatMapOpacity[0] + ")";
            if (heatMapOpacity[0] === 0) {
                ctx.fillStyle = "rgba(239,239,240,1)";
            }
            ctx.beginPath();
            ctx.moveTo(2, 2);
            ctx.lineTo(2, 199);
            ctx.lineTo(149, 199);
            ctx.lineTo(149, 2);
            ctx.closePath();
            ctx.fill();

            //Front Right
            ctx.fillStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.moveTo(151, 2);
            ctx.lineTo(151, 199);
            ctx.lineTo(298, 199);
            ctx.lineTo(298, 2);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "rgba(0,131,63," + heatMapOpacity[1] + ")";
            if (heatMapOpacity[1] === 0) {
                ctx.fillStyle = "rgba(239,239,240,1)";
            }
            ctx.beginPath();
            ctx.moveTo(151, 2);
            ctx.lineTo(151, 199);
            ctx.lineTo(298, 199);
            ctx.lineTo(298, 2);
            ctx.closePath();
            ctx.fill();

            //Back Left
            ctx.fillStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.moveTo(2, 201);
            ctx.lineTo(2, 348);
            ctx.lineTo(149, 348);
            ctx.lineTo(149, 201);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "rgba(0,131,63," + heatMapOpacity[2] + ")";
            if (heatMapOpacity[2] === 0) {
                ctx.fillStyle = "rgba(210,215,211,1)";
            }
            ctx.beginPath();
            ctx.moveTo(2, 201);
            ctx.lineTo(2, 348);
            ctx.lineTo(149, 348);
            ctx.lineTo(149, 201);
            ctx.closePath();
            ctx.fill();

            //Back right
            ctx.fillStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.moveTo(151, 201);
            ctx.lineTo(151, 348);
            ctx.lineTo(298, 348);
            ctx.lineTo(298, 201);
            ctx.closePath();
            ctx.fill();


            ctx.fillStyle = "rgba(0,131,63," + heatMapOpacity[3] + ")";
            if (heatMapOpacity[3] === 0) {
                ctx.fillStyle = "rgba(239,239,240,1)";
            }
            ctx.beginPath();
            ctx.moveTo(151, 201);
            ctx.lineTo(151, 348);
            ctx.lineTo(298, 348);
            ctx.lineTo(298, 201);
            ctx.closePath();
            ctx.fill();

            //T-zone - set a white (or whatever colour background) and then add the opacity layer on top

            ctx.fillStyle = "rgba(0,0,0)";
            ctx.beginPath();
            ctx.moveTo(100, 150);
            ctx.lineTo(100, 250);
            ctx.lineTo(200, 250);
            ctx.lineTo(200, 150);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.moveTo(102, 152);
            ctx.lineTo(102, 248);
            ctx.lineTo(198, 248);
            ctx.lineTo(198, 152);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "rgba(0,131,63," + heatMapOpacity[4] + ")";
            if (heatMapOpacity[4] === 0) {
                ctx.fillStyle = "rgba(239,239,240,1)";
            }
            ctx.beginPath();
            ctx.moveTo(102, 152);
            ctx.lineTo(102, 248);
            ctx.lineTo(198, 248);
            ctx.lineTo(198, 152);
            ctx.closePath();
            ctx.fill();
        }
    }

    //Style for the square that contains the Points Won display
    var squareStyle = {
        margin: 'auto',
    };

    // This is what determines what the filters actually do
    const filterChange = (position) => {

        if (!filterLength) {
            setLengthOfFilters();
            setFilterLength(!filterLength);
        }

        const updatedFilterStatus = filterStatus.map((item, index) =>
            index === position ? !item : item);
        setFilterStatus(updatedFilterStatus);

        const playerFilterStatus = updatedFilterStatus.slice(0, uniquePlayers.length);
        const matchFilterStatus = updatedFilterStatus.slice(uniquePlayers.length, uniquePlayers.length + gameTitles.length);
        const shotFilterStatus = updatedFilterStatus.slice(uniquePlayers.length + gameTitles.length,
            uniquePlayers.length + gameTitles.length + uniqueShots.length);
        const zoneFilterStatus = updatedFilterStatus.slice(uniquePlayers.length + gameTitles.length + uniqueShots.length,
            uniquePlayers.length + gameTitles.length + uniqueShots.length + gameZoneLabels.length);
        const gameWonByFilterStatus = updatedFilterStatus.slice(uniquePlayers.length + gameTitles.length + uniqueShots.length + gameZoneLabels.length,
            uniquePlayers.length + gameTitles.length + uniqueShots.length + gameZoneLabels.length + uniquePlayers.length);

        const playerIndices = playerFilterStatus.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []);
        const matchIndices = matchFilterStatus.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []);
        const shotIndices = shotFilterStatus.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []);
        const zoneIndices = zoneFilterStatus.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []);
        const gameWonByIndices = gameWonByFilterStatus.reduce(
            (out, bool, index) => (bool ? out.concat(index) : out),
            []);

        var playerData = [];
        for (var i = 0; i < playerIndices.length; i++) {
            playerData.push(uniquePlayers[playerIndices[i]]);
        }
        var matchData = [];
        for (i = 0; i < matchIndices.length; i++) {
            matchData.push(gameTitles[matchIndices[i]]);
        }
        var shotData = [];
        for (i = 0; i < shotIndices.length; i++) {
            shotData.push(uniqueShots[shotIndices[i]]);
        }
        let zoneData = [];
        for (i = 0; i < zoneIndices.length; i++) {
            zoneData.push(zoneIndices[i] + 1);
        }
        let gameWonByData = [];
        for (i = 0; i < gameWonByIndices.length; i++) {
            gameWonByData.push(uniquePlayers[gameWonByIndices[i]]);
        }


        let playerChecker = (filterStatus) => filterStatus.slice(0, uniquePlayers.length).every((v) => v === false);

        let gameChecker = (filterStatus) => filterStatus.slice(uniquePlayers.length, uniquePlayers.length + gameTitles.length).every((v) => v === false);

        let shotChecker = (filterStatus) => filterStatus.slice(uniquePlayers.length + gameTitles.length,
            uniquePlayers.length + gameTitles.length + uniqueShots.length).every((v) => v === false);

        let zoneChecker = (filterStatus) => filterStatus.slice(uniquePlayers.length + gameTitles.length + uniqueShots.length,
            uniquePlayers.length + gameTitles.length + uniqueShots.length + gameZoneLabels.length).every((v) => v === false);

        let wonByChecker = (filterStatus) => filterStatus.slice(uniquePlayers.length + gameTitles.length + uniqueShots.length + gameZoneLabels.length,
            uniquePlayers.length + gameTitles.length + uniqueShots.length + gameZoneLabels.length + uniquePlayers.length).every((v) => v === false);

        let allChecker = (filterStatus) => filterStatus.every((v) => v === false);

        let filteredMatches = [];
        //check to see if no filters are active
        if (allChecker(updatedFilterStatus)) {
            setFilterMatches(matchDataBreakdown);

            // THIS IS WHAT DRAWS THE HEAT MAP
            // first put all the annotations into one array
            let allAnnotations = getAllAnnotations(matchDataBreakdown);
            // then draw the actual heat map
            drawHeatMap(allAnnotations);

        } else {
            filteredMatches = matchDataBreakdown;
            //check if the game filter is active 
            if (!gameChecker(updatedFilterStatus)) {
                filteredMatches = filteredMatches.filter((match) => (matchData.includes(match.title)));
            }

            if (!playerChecker(updatedFilterStatus)) {
                //filter the matches by the selected players
                filteredMatches = filteredMatches.filter((match) => (playerData.includes(match.player1)
                    || playerData.includes(match.player2)));

                //filter the matches annotations by the selected players
                for (i = 0; i < filteredMatches.length; i++) {
                    let filteredPlayers = [];
                    if (playerData.includes(filteredMatches[i].player1)) {
                        filteredPlayers.push(1);
                    }
                    if (playerData.includes(filteredMatches[i].player2)) {
                        filteredPlayers.push(2);
                    }
                    for (let x = 0; x < filteredMatches[i].games.length; x++) {
                        filteredMatches[i].games[x].gameAnnotations = filteredMatches[i].games[x].gameAnnotations.filter((annotation) => (filteredPlayers.includes(annotation.playerNumber)
                            || annotation.components.type === "game" || annotation.components.type === "rally"));

                        filteredMatches[i].games[x].shotWin = filteredMatches[i].games[x].shotWin.filter((annotation) => (filteredPlayers.includes(annotation.playerNumber)
                            || annotation.components.type === "game" || annotation.components.type === "rally"));

                        filteredMatches[i].games[x].shotError = filteredMatches[i].games[x].shotError.filter((annotation) => (filteredPlayers.includes(annotation.playerNumber)
                            || annotation.components.type === "game" || annotation.components.type === "rally"));
                    }

                }
            }

            //check if the shot filter is active
            if (!shotChecker(updatedFilterStatus)) {
                for (i = 0; i < filteredMatches.length; i++) {
                    for (let x = 0; x < filteredMatches[i].games.length; x++) {
                        filteredMatches[i].games[x].gameAnnotations = filteredMatches[i].games[x].gameAnnotations.filter((annotation) =>
                        (shotData.includes(annotation.components.id) || annotation.components.type === "game"
                            || annotation.components.type === "rally" || annotation.components.type === "score"));

                        filteredMatches[i].games[x].shotWin = filteredMatches[i].games[x].shotWin.filter((annotation) =>
                            (shotData.includes(annotation.components.id)));

                        filteredMatches[i].games[x].shotError = filteredMatches[i].games[x].shotError.filter((annotation) =>
                            (shotData.includes(annotation.components.id)));



                    }
                }
            }
            //check if the won by filter is active
            if (!wonByChecker(updatedFilterStatus)) {
                //filter the matches by the selected players
                filteredMatches = filteredMatches.filter((match) => (gameWonByData.includes(match.player1)
                    || gameWonByData.includes(match.player2)));

                //filter the matches annotations by the selected players
                for (i = 0; i < filteredMatches.length; i++) {

                    let filteredPlayers = [];
                    if (gameWonByData.includes(filteredMatches[i].player1)) {
                        filteredPlayers.push(1);
                    }
                    if (gameWonByData.includes(filteredMatches[i].player2)) {
                        filteredPlayers.push(2);
                    }
                    filteredMatches[i].games = filteredMatches[i].games.filter((game) =>
                        (filteredPlayers.includes(game.winner)));
                }
            }
            //check if the position filter is active
            if (!zoneChecker(updatedFilterStatus)) {
                for (i = 0; i < filteredMatches.length; i++) {
                    for (let x = 0; x < filteredMatches[i].games.length; x++) {
                        filteredMatches[i].games[x].gameAnnotations = filteredMatches[i].games[x].gameAnnotations.filter((annotation) =>
                        (zoneData.includes(annotation.playerPos) || annotation.components.type === "game"
                            || annotation.components.type === "rally"));

                        filteredMatches[i].games[x].shotWin = filteredMatches[i].games[x].shotWin.filter((annotation) =>
                            (zoneData.includes(annotation.playerPos)));

                        filteredMatches[i].games[x].shotError = filteredMatches[i].games[x].shotError.filter((annotation) =>
                            (zoneData.includes(annotation.playerPos)));
                    }
                }
            }
            setFilterMatches(filteredMatches);

            // THIS IS WHAT DRAWS THE HEAT MAP
            // first put all the annotations into one array
            let allAnnotations = getAllAnnotations(filteredMatches);
            // then draw the actual heat map
            drawHeatMap(allAnnotations);
        }

    };

    return (
        <div className="container mx-auto px-5 py-3">
            <h2 className="text-2xl sm:text-3xl font-bold leading-7 text-gray-900 mb-5">
                <span className="align-middle">Match Statistics</span>
            </h2>
            <div className="grid grid-cols-16">
                <div className="col-span-3">
                    <h3 className="font-bold text-lg mb-1 text-left">
                        Filter by Player
                    </h3>

                    {uniquePlayers.map((player, index) => {
                        return (
                            <>
                                <div key={player}>
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={filterStatus[index]}
                                            onChange={() => filterChange(index, player)}
                                        />
                                        <span className="ml-2">{player}</span>
                                    </label>
                                </div>
                            </>
                        );
                    })}
                </div>
                <div className="col-span-3">
                    <h3 className="font-bold text-lg mb-1 text-left">
                        Filter by Game Session
                    </h3>

                    {gameTitles.map((title, index) => {
                        return (
                            <>
                                <div key={title}>
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={filterStatus[index + uniquePlayers.length]}
                                            onChange={() => filterChange(index + uniquePlayers.length, title)}
                                        />
                                        <span className="ml-2">{title}</span>
                                    </label>
                                </div>
                            </>
                        );
                    })}
                </div>
                <div className="col-span-3">
                    <h3 className="font-bold text-lg mb-1 text-left">
                        Filter by Shot Type
                    </h3>

                    {uniqueShots.map((shot, index) => {
                        return (
                            <>
                                <div key={shot}>
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={filterStatus[index + uniquePlayers.length + gameTitles.length]}
                                            onChange={() => filterChange(index + uniquePlayers.length + gameTitles.length, shot)}
                                        />
                                        <span className="ml-2">{shot}</span>
                                    </label>
                                </div>
                            </>
                        );
                    })}
                </div>
                <div className="col-span-3">
                    <h3 className="font-bold text-lg mb-1 text-left">
                        Filter by Player Position
                    </h3>

                    {gameZoneLabels.map((zone, index) => {
                        return (
                            <>
                                <div key={zone}>
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={filterStatus[index + uniquePlayers.length + gameTitles.length + uniqueShots.length]}
                                            onChange={() => filterChange(index + uniquePlayers.length + gameTitles.length + uniqueShots.length, zone)}
                                        />
                                        <span className="ml-2">{zone}</span>
                                    </label>
                                </div>
                            </>
                        );
                    })}
                </div>
                <div className="col-span-3">
                    <h3 className="font-bold text-lg mb-1 text-left">
                        Filter by Game Won By
                    </h3>

                    {uniquePlayers.map((player, index) => {
                        return (
                            <>
                                <div key={player}>
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={filterStatus[index + uniquePlayers.length + gameTitles.length + uniqueShots.length
                                                + gameZoneLabels.length]}
                                            onChange={() => filterChange(index + uniquePlayers.length + gameTitles.length + uniqueShots.length
                                                + gameZoneLabels.length, player)}
                                        />
                                        <span className="ml-2">{player}</span>
                                    </label>
                                </div>
                            </>
                        );
                    })}
                </div>
                <div className="col-span-8">
                    <Bar
                        data={shotCountChart}
                        options={{
                            legend: {
                                display: false,
                            },
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            max: shotCount.maxY,
                                            min: 0,
                                            stepSize: 1,
                                        },
                                    },
                                ],
                            },
                            title: {
                                display: true,
                                text: shotCountChart.title,
                                fontSize: 18,
                            },
                        }}
                    />
                </div>

                <div className="col-span-8">
                    <Pie
                        data={handCountChart}
                        options={{
                            legend: {
                                display: false,
                            },

                            title: {
                                display: true,
                                text: handCountChart.title,
                                fontSize: 18,
                            },
                        }}
                    />
                </div>

                <div className="col-span-8">
                    <Pie
                        data={playerShotsCountChart}
                        options={{
                            legend: {
                                display: false,
                            },

                            title: {
                                display: true,
                                text: playerShotsCountChart.title,
                                fontSize: 18,
                            },
                        }}
                    />
                </div>

                <div className="col-span-8">
                    <Pie
                        data={shotWinCountChart}
                        options={{
                            legend: {
                                display: false,
                            },

                            title: {
                                display: true,
                                text: shotWinCountChart.title,
                                fontSize: 18,
                            },
                        }}
                    />
                </div>

                <div className="col-span-8">
                    <Pie
                        data={shotErrorCountChart}
                        options={{
                            legend: {
                                display: false,
                            },

                            title: {
                                display: true,
                                text: shotErrorCountChart.title,
                                fontSize: 18,
                            },
                        }}
                    />
                </div>

                <div className="col-span-8" style={squareStyle}>
                    <h3 className="font-bold text-lg mb-1 text-left">
                        Heat Map: Shots by Location
                    </h3>
                    <canvas id="canvas" width="300" height="400"></canvas>
                </div>

                <div className="col-span-12 mt-10">
                    <Bar
                        data={{
                            labels: labelData,
                            datasets: fullGamesDataset,
                        }}
                        options={{
                            title: {
                                display: true,
                                text: 'Shot Count per Game',
                                fontSize: 18,
                            },
                            scales: {
                                xAxes: [
                                    {
                                        display: true,
                                        gridLines: {
                                            display: true,
                                            color: 'red',
                                            lineWidth: 5,
                                            drawBorder: false,
                                        },
                                        ticks: {
                                            padding: 5,
                                        },
                                    },
                                ],
                                yAxes: [
                                    {
                                        ticks: {
                                            max: shotCount.maxY,
                                            min: 0,
                                            stepSize: 1,
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                </div>

                <div className="col-span-12 mt-10">
                    <Bar
                        data={{
                            labels: opponentPositionLabels,
                            datasets: fullOpponentPositionDataset,
                        }}
                        options={{
                            title: {
                                display: true,
                                text: 'Shot Count per Opponent Position',
                                fontSize: 18,
                            },
                            scales: {
                                xAxes: [
                                    {
                                        display: true,
                                        gridLines: {
                                            display: true,
                                            color: 'red',
                                            lineWidth: 5,
                                            drawBorder: false,
                                        },
                                        ticks: {
                                            padding: 5,
                                        },
                                    },
                                ],
                                yAxes: [
                                    {
                                        ticks: {
                                            max: shotCount.maxY,
                                            min: 0,
                                            stepSize: 1,
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                </div>

            </div>
        </div>
    );
}