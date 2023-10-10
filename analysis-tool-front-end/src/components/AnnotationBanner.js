import React, { useState, useEffect } from 'react';
// Pop up on video screen at timestamp of annotation
export default function AnnotationBanner({
  match,
  annotations,
  currentVideoTime,
}) {
  const [text, setText] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState({});
  const bannerRange = 1;

  const updateCurrentAnnotation = (annotation) => {
    setCurrentAnnotation(annotation);
  };

  useEffect(() => {
    if (Object.entries(currentAnnotation).length > 0) {
      if (
        currentVideoTime > currentAnnotation.timestamp + bannerRange ||
        currentVideoTime < currentAnnotation.timestamp - bannerRange
      ) {
        setCurrentAnnotation({});
        setText('');
      }
    }

    if (!text) {
      for (let annotation of annotations) {
        if (
          currentVideoTime >= annotation.timestamp - bannerRange &&
          currentVideoTime <= annotation.timestamp + bannerRange
        ) {
          updateCurrentAnnotation(annotation);
            if (annotation.components.type === 'shot' || annotation.components.type === 'score') {
            setText(
              match.players['player' + annotation.playerNumber.toString()] +
                ' | ' +
                annotation.components.id
            );
          } else if (annotation.components.type === 'game' || annotation.components.type === 'rally') {
            setText(annotation.components.id);
          }
          break;
        }
      }
    }
  }, [annotations, currentVideoTime, currentAnnotation, text, match]);

  if (Object.entries(currentAnnotation).length > 0) {
    return (
      <>
        <div
          id="banner"
          className="bg-yellow-300 w-banner h-14 grid place-content-center text-green-700 font-bold pb-1 text-2xl animate-fade-in-down rounded-none"
        >
          {text}
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
