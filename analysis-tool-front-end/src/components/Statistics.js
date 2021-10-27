import { React, useState, useEffect } from 'react';
import axios from 'axios';

import { Bar, Pie } from 'react-chartjs-2';

export default function Statistics(props) {
  const { baseUrl } = props;
  const matchId = window.location.pathname.substring(7);
  const [annotations, setAnnotations] = useState([]);
  let unique_shots = [
    ...new Set(
      annotations
        .filter((annotation) => annotation.components.type === 'shot')
        .map((annotation) => annotation.components.id)
    ),
  ];

  useEffect(() => {
    axios
      .get(baseUrl + '/annotate/' + matchId + '/all')
      .then((res) => res.data)
      .then((annotations) => setAnnotations(annotations));
  }, [baseUrl, matchId]);

  let shotCount = [];
  for (let i = 0; i < unique_shots.length; i++) {
    shotCount[i] = annotations.filter(
      (item) => item.components.id === unique_shots[i]
    ).length;
  }

  const handLabels = ['BH', 'FH'];
  let handCount = [0, 0];
  for (let i = 0; i < handCount.length; i++) {
    handCount[i] = annotations.filter((item) =>
      item.components.id.includes(handLabels[i])
    ).length;
  }
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

  const shotCountChart = {
    labels: unique_shots,
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

  // Find the times where user clicked "New Game"
  let newGameTimes = annotations
    .filter((annotation) => annotation.components.type === 'game')
    .map((annotation) => annotation.timestamp);

  let shotGameData = [];
  let labelData = [];

  // Find all annotations within each game & create labels
  for (let i = 0; i < newGameTimes.length + 1; i++) {
    if (i === 0) {
      shotGameData[i] = annotations
        .filter(
          (annotation) =>
            (annotation.components.type === 'shot') &
            (annotation.timestamp < newGameTimes[0])
        )
        .map((annotation) => annotation.components.id);
    } else if (i === newGameTimes.length) {
      shotGameData[i] = annotations
        .filter(
          (annotation) =>
            (annotation.components.type === 'shot') &
            (annotation.timestamp > newGameTimes[newGameTimes.length - 1])
        )
        .map((annotation) => annotation.components.id);
    } else {
      shotGameData[i] = annotations
        .filter(
          (annotation) =>
            (annotation.components.type === 'shot') &
            ((annotation.timestamp > newGameTimes[i - 1]) &
              (annotation.timestamp < newGameTimes[i]))
        )
        .map((annotation) => annotation.components.id);
    }
    labelData.push('Game ' + (i + 1));
  }

  // Count how many times each shot type occured per game
  const countOccurrences = (arr, val) => {
    const array = arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    return array;
  };

  let gameData = [];
  let temp = [];
  let fullGamesDataset = [];

  // Create array full of the number of occurences in each shot
  for (let i = 0; i < newGameTimes.length + 1; i++) {
    for (let k = 0; k < unique_shots.length; k++) {
      temp.push(countOccurrences(shotGameData[i], unique_shots[k]));
    }
  }

  // Rearrange array so it can be passed into chartjs, puts all the shot occurrences for each shot across all games
  for (let k = 0; k < unique_shots.length; k++) {
    let temp2 = [];
    for (let i = 0; i < newGameTimes.length + 1; i++) {
      temp2.push(temp[k + i * unique_shots.length]);
    }
    gameData.push(temp2);
    // Create datasets for each shot type, label them as the shot id
    let data = {
      label: unique_shots[k],
      data: gameData[k],
      backgroundColor: backgroundColors[k],
      borderWidth: 0,
    };
    fullGamesDataset.push(data);
  }

  return (
    <div className="container mx-auto px-5 py-3">
      <h2 className="text-2xl sm:text-3xl font-bold leading-7 text-gray-900 mb-5">
        <span className="align-middle">Match Statistics</span>
      </h2>
      <div className="grid grid-cols-12">
        <div className="col-span-12 sm:col-span-6">
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

        <div className="col-span-12 sm:col-span-6">
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
      </div>
    </div>
  );
}
