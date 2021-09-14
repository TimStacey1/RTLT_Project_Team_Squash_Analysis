import React, { useState, useEffect } from 'react';

export default function AnnotationBanner({
  match,
  annotations,
  currentVideoTime
}) {
  const [text, setText] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState({});
  const bannerRange = 1;

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
          if (annotation.components.type === 'shot') {
            setText(
              playerNumToPlayerName(annotation.playerNumber) +
                ' | ' +
                annotation.components.id
            );
          } else if (annotation.components.type === 'game') {
            setText(annotation.components.id);
          }
          break;
        }
      }
    }
  }, [annotations, currentVideoTime]);

  const updateCurrentAnnotation = (annotation) => {
    setCurrentAnnotation(annotation);
  };

  const playerNumToPlayerName = (num) => {
    return match.players['player' + num.toString()];
  };

  if (Object.entries(currentAnnotation).length > 0) {
    return (
      <>
        <div className="bg-gray-300 w-banner h-14 grid place-content-center text-2xl animate-fade-in-down rounded-sm">
          {text}
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
