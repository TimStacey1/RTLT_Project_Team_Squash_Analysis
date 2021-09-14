import React, { useState, useEffect } from 'react';
import AnnotationList from './AnnotationList';
import AnnotationVideo from './AnnotationVideo';
import AnnotationBanner from './AnnotationBanner';
import AnnotationControls from './AnnotationControls';
import axios from 'axios';

export default function AnnotationInterface({ baseUrl }) {
  const matchId = window.location.pathname.substring(7);
  const [annotationsChanged, setAnnotationsChanged] = useState(true);
  const [match, setMatch] = useState({});
  const [seekTime, setSeekTime] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [pausedState, setCurrentPausedState] = useState(true);
  const [videoPaused, setVideoPaused] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const annotationRange = 10;

  useEffect(() => {
    if (annotationsChanged) {
      axios
        .get(baseUrl + '/match/' + matchId + '/get')
        .then((res) => res.data)
        .then((match) => {
          setMatch(match);
          setVideoUrl(baseUrl + '/video/' + matchId + '/stream');
        })
        .then(
          axios
            .get(baseUrl + '/annotate/' + matchId + '/all')
            .then((res) => res.data.sort((a, b) => a.timestamp - b.timestamp))
            .then((annotations) => {
              setAnnotations(annotations);
            })
            .then(setAnnotationsChanged(!annotationsChanged))
        );
    }
  }, [annotationsChanged]);

  const annotationsUpdated = () => {
    setAnnotationsChanged(!annotationsChanged);
  };

  const jumpToAnnotation = (annotationTimeStamp) => {
    setVideoPaused(false);
    setSeekTime(
      annotationTimeStamp > annotationRange
        ? annotationTimeStamp - annotationRange
        : 1
    );
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
            annotations={annotations}
            annotationsUpdated={annotationsUpdated}
            jumpToAnnotation={jumpToAnnotation}
          />
        </div>
        <div className="col-span-12 ml-2 mr-2 h-desktop relative">
          <AnnotationVideo
            videoUrl={videoUrl}
            seekTime={seekTime}
            updateCurrentVideoTime={updateCurrentVideoTime}
            updateCurrentPausedState={updateCurrentPausedState}
            videoPaused={videoPaused}
          />
          <div className="absolute top-3 left-3">
            <AnnotationBanner
              match={match}
              annotations={annotations}
              currentVideoTime={currentVideoTime}
              annotationRange={annotationRange}
            />
          </div>
        </div>
        <div
          className="w-controls h-desktop transition-all -right-96 fixed transform hover:-translate-x-96"
          onMouseEnter={() => updateControlsOpen(true)}
          onMouseLeave={() => updateControlsOpen(false)}
        >
          <AnnotationControls
            baseUrl={baseUrl}
            matchId={matchId}
            annotationsUpdated={annotationsUpdated}
            getAnnotationTimestamp={getAnnotationTimestamp}
          />
        </div>
      </div>
    </>
  );
}
