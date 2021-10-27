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
  const [seekTimeChanged, setSeekTimeChanged] = useState(false);
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
  }, [annotationsChanged, baseUrl, matchId]);

  const annotationsUpdated = () => {
    setAnnotationsChanged(!annotationsChanged);
  };

  const jumpToAnnotation = (annotationTimeStamp, filterAnnotations) => {
    setVideoPaused(false);
    setSeekTime(
      annotationTimeStamp > annotationRange
        ? annotationTimeStamp - annotationRange
        : 1
    );
    setSeekTimeChanged(!seekTimeChanged);
    setAnnotations(filterAnnotations);
  };

  const clearFilter = () => {
    setAnnotationsChanged(!annotationsChanged);
  };

  const pauseVideo = () => {
    setVideoPaused(true);
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
      setVideoPaused(false);
      setSeekTime(currentVideoTime);
    }
  };

  return (
    <>
      <div className="grid grid-cols-16 h-full mx-3 mt-1">
        <div className="col-span-3 mr-3 h-desktop">
          <AnnotationList
            baseUrl={baseUrl}
            match={match}
            annotations={annotations}
            annotationsUpdated={annotationsUpdated}
            jumpToAnnotation={jumpToAnnotation}
            clearFilter={clearFilter}
            pauseVideo={pauseVideo}
          />
        </div>
        <div className="col-span-13 h-desktop relative mr-12">
          <AnnotationVideo
            videoUrl={videoUrl}
            videoPaused={videoPaused}
            seekTime={seekTime}
            seekTimeChanged={seekTimeChanged}
            updateCurrentVideoTime={updateCurrentVideoTime}
            updateCurrentPausedState={updateCurrentPausedState}
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
          className="w-controls h-desktop transition-all -right-96 fixed transform hover:-translate-x-96 z-10"
          onMouseEnter={() => updateControlsOpen(true)}
          onMouseLeave={() => updateControlsOpen(false)}
        >
          <AnnotationControls
            baseUrl={baseUrl}
            match={match}
            annotationsUpdated={annotationsUpdated}
            getAnnotationTimestamp={getAnnotationTimestamp}
          />
        </div>
      </div>
    </>
  );
}
