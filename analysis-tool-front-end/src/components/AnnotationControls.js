import { React, useState, useEffect } from 'react';
import AnnotationButton from './AnnotationButton';

const axios = require('axios').default;

export default function AnnotationControls(props) {
  const { baseUrl, matchId, updateAnnotations, getAnnotationTimestamp } = props;
  const apiUrl = baseUrl + '/annotate/' + matchId + '/new';
  const shots = [
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
  ];
  const [selectedAnnotation, setSelectedAnnotation] = useState({});
  const numAdditionalButtons = 8;

  const updateSelectedAnnotation = (selectedShot) => {
    if (Object.entries(selectedShot).length > 0) {
      let annotationTimeStamp = getAnnotationTimestamp();
      annotationTimeStamp =
        annotationTimeStamp > 4 ? annotationTimeStamp - 4 : 1;
      setSelectedAnnotation({
        timestamp: annotationTimeStamp,
        playerNumber: 1,
        shot: selectedShot
      });
    }
  };

  useEffect(() => {
    if (Object.entries(selectedAnnotation).length > 0) {
      console.log(selectedAnnotation);
      axios
        .post(apiUrl, selectedAnnotation)
        .then((res) => console.log(res.data.message))
        .then(updateAnnotations());
    }
  }, [selectedAnnotation]);

  return (
    <>
      <div className="h-full bg-gray-300 flex">
        <div className="w-12 h-full grid place-content-center">
          <div className="w-96 transform -rotate-90 text-xl grid place-content-center">
            Annotation Controls
          </div>
        </div>
        <ul className="w-full grid grid-cols-2 grid-rows-9 mx-2 py-4 gap-x-3 gap-y-4 h-full place-items-center">
          {shots.map((shot) => (
            <li
              className="w-full h-full"
              onClick={() => updateSelectedAnnotation(shot)}
            >
              <AnnotationButton
                key={shot.id}
                name={shot.id}
                selected={selectedAnnotation.id === shot.id}
                disabled={false}
              />
            </li>
          ))}
          {Array(numAdditionalButtons)
            .fill()
            .map(() => (
              <li className="w-full h-full">
                <AnnotationButton
                  name={'Additional Button'}
                  disabled={true}
                  selected={false}
                />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
