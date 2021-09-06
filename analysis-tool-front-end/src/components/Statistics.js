import { React, useState, useEffect } from 'react';
import axios from 'axios';

import { Bar, Pie } from 'react-chartjs-2';

export default function Statistics(props) {
  const { baseUrl } = props;
  const matchId = window.location.pathname.substring(7);
  console.log(matchId);
  const [annotations, setAnnotations] = useState([]);
  var unique_shots = [
    ...new Set(
      annotations
        .filter((annotation) => annotation.components.type === 'shot')
        .map((annotation) => annotation.components.id)
    )
  ];

  useEffect(() => {
    axios
      .get(baseUrl + '/annotate/' + matchId + '/all')
      .then((res) => res.data)
      .then((annotations) => setAnnotations(annotations));
  }, []);
  console.log(annotations);

  let shotCount = [];
  for (var i = 0; i < unique_shots.length; i++) {
    shotCount[i] = annotations.filter(
      (item) => item.components.id === unique_shots[i]
    ).length;
  }

  const handLabels = ['BH', 'FH'];
  let handCount = [0, 0];
  for (var i = 0; i < handCount.length; i++) {
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
    'rgb(0, 111, 58)',
    'rgb(255, 193, 7)',
    'rgb(27, 131, 190)',
    'rgb(128, 128, 128)',
    'rgb(0, 111, 58)',
    'rgb(255, 193, 7)',
    'rgb(27, 131, 190)',
    'rgb(128, 128, 128)'
  ];

  const shotCountChart = {
    labels: unique_shots,
    datasets: [
      {
        label: 'No. of Shots',
        backgroundColor: '#006f3a',
        borderColor: '#ffffff',
        borderWidth: 0,
        data: shotCount,
        backgroundColor: backgroundColors
      }
    ],
    title: 'Shot Count'
  };

  const handCountChart = {
    labels: handLabels,
    datasets: [
      {
        label: 'No. of Shots',
        backgroundColor: '#006f3a',
        borderColor: '#ffffff',
        borderWidth: 5,
        data: handCount,
        backgroundColor: backgroundColors
      }
    ],
    title: 'Backhand vs Forehand'
  };

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
                display: false
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      max: shotCount.maxY,
                      min: 0,
                      stepSize: 1
                    }
                  }
                ]
              },
              title: {
                display: true,
                text: shotCountChart.title,
                fontSize: 18
              }
            }}
          />
        </div>

        <div className="col-span-12 sm:col-span-6">
          <Pie
            data={handCountChart}
            options={{
              legend: {
                display: false
              },

              title: {
                display: true,
                text: handCountChart.title,
                fontSize: 18
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
