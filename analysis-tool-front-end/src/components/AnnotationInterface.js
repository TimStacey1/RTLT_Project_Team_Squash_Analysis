import React, { useState, useEffect } from 'react';
import AnnotationList from './AnnotationList';
import AnnotationVideo from './AnnotationVideo';
import AnnotationControls from './AnnotationControls';

const axios = require('axios').default;
const matchId = window.location.pathname.substring(7);

export default function AnnotationInterface(props) {
  const { baseUrl } = props;
  const [annotationsChanged, setAnnotationsChanged] = useState(true);
  const [match, setMatch] = useState({});
  const [seekTime, setSeekTime] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [pausedState, setCurrentPausedState] = useState(true);
  const [videoPaused, setVideoPaused] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (annotationsChanged) {
      axios
        .get(baseUrl + '/match/' + matchId + '/get')
        .then((res) => res.data)
        .then((match) => {
          setMatch(match);
          setVideoUrl(baseUrl + '/video/' + matchId + '/stream');
        })
        .then(updateAnnotations);
    }
  }, [annotationsChanged]);

  const updateAnnotations = () => {
    setAnnotationsChanged(!annotationsChanged);
  };

  const jumpToAnnotation = (annotationTimeStamp) => {
    setVideoPaused(false);
    setSeekTime(annotationTimeStamp);
  };

  const getAnnotationTimestamp = () => {
    return currentVideoTime;
  };

  const updateCurrentVideoTime = (time) => {
    setCurrentVideoTime(Math.round(time));
  };

  const updateCurrentPausedState = (state) => {
    setCurrentPausedState(state);
  };

  const updateControlsOpen = (controlsAreOpen) => {
    if (controlsAreOpen && !pausedState) {
      setVideoPaused(true);
    } else if (!controlsAreOpen && videoPaused) {
      setSeekTime(currentVideoTime);
      setVideoPaused(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-16 w-full h-full">
        <div className="col-span-3 mr-1 h-desktop">
          <AnnotationList
            baseUrl={baseUrl}
            match={match}
            updateAnnotations={updateAnnotations}
            jumpToAnnotation={jumpToAnnotation}
          />
        </div>
        <div className="col-span-12 ml-2 mr-2 h-desktop">
          <AnnotationVideo
            videoUrl={videoUrl}
            seekTime={seekTime}
            updateCurrentVideoTime={updateCurrentVideoTime}
            updateCurrentPausedState={updateCurrentPausedState}
            videoPaused={videoPaused}
          />
        </div>
        <div
          className="w-controls h-desktop transition-all -right-96 fixed transform hover:-translate-x-96"
          onMouseEnter={() => updateControlsOpen(true)}
          onMouseLeave={() => updateControlsOpen(false)}
        >
          <AnnotationControls
            baseUrl={baseUrl}
            matchId={matchId}
            updateAnnotations={updateAnnotations}
            getAnnotationTimestamp={getAnnotationTimestamp}
          />
        </div>
      </div>
    </>
  );
}
