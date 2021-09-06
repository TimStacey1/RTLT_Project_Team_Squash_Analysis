// React dependencies
import { React, useState, useEffect } from 'react';

// Third party dependencies
import axios from 'axios';

// Custom Components
import AnnotationButton from './AnnotationButton';

export default function AnnotationControls({
  baseUrl,
  matchId,
  updateAnnotations,
  getAnnotationTimestamp
}) {
  const annotationComponents = [
    { type: 'shot', id: 'BH Drive', hand: 'Backhand' },
    { type: 'shot', id: 'FH Drive', hand: 'ForeHand' },
    { type: 'shot', id: 'BH X-Court', hand: 'Backhand' },
    { type: 'shot', id: 'FH X-Court', hand: 'ForeHand' },
    { type: 'shot', id: 'BH Boast', hand: 'Backhand' },
    { type: 'shot', id: 'FH Boast', hand: 'ForeHand' },
    { type: 'shot', id: 'BH Drop', hand: 'Backhand' },
    { type: 'shot', id: 'FH Drop', hand: 'ForeHand' },
    {
      type: 'shot',
      id: 'BH Volley Drop',
      hand: 'Backhand',
      approach: 'Volley'
    },
    {
      type: 'shot',
      id: 'FH Volley Drop',
      hand: 'ForeHand',
      approach: 'Volley'
    },
    { type: 'shot', id: 'BH Kill', hand: 'Backhand' },
    { type: 'shot', id: 'FH Kill', hand: 'ForeHand' },
    { type: 'game', id: 'New Game' }
  ];
  const numAdditionalButtons = 6;

  const [selectedAnnotation, setSelectedAnnotation] = useState({});

  const updateSelectedAnnotation = (selectedAnnotationComponent) => {
    if (Object.entries(selectedAnnotationComponent).length > 0) {
      let annotationTimeStamp = getAnnotationTimestamp();
      annotationTimeStamp =
        annotationTimeStamp > 4 ? annotationTimeStamp - 4 : 1;

      if (selectedAnnotationComponent.type === 'shot') {
        setSelectedAnnotation({
          timestamp: annotationTimeStamp,
          playerNumber: 1,
          components: selectedAnnotationComponent
        });
      } else if (selectedAnnotationComponent.type === 'game') {
        setSelectedAnnotation({
          timestamp: annotationTimeStamp,
          components: selectedAnnotationComponent
        });
      }
    }
  };

  useEffect(() => {
    if (Object.entries(selectedAnnotation).length > 0) {
      axios
        .post(baseUrl + '/annotate/' + matchId + '/new', selectedAnnotation)
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
          {annotationComponents
            .filter((component) => component.type === 'shot')
            .map((shot) => (
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
          {annotationComponents
            .filter((component) => component.type === 'game')
            .map((game) => (
              <li
                className="w-full h-full col-span-2"
                onClick={() => updateSelectedAnnotation(game)}
              >
                <AnnotationButton
                  key={game.id}
                  name={game.id}
                  selected={selectedAnnotation.id === game.id}
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
