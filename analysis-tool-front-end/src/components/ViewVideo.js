import { React, useState, useEffect, useRef } from 'react';
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
  BigPlayButton,
} from 'video-react';
import 'video-react/dist/video-react.css';
import AnnotationBanner from './AnnotationBanner';


export default function ViewVideo({baseUrl}) {
  const axios = require('axios').default;
  const matchId = window.location.pathname.substring(12);
  const [videoUrl, setVideoUrl] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const playerRef = useRef();
  const [match, setMatch] = useState({});

  useEffect(() => {

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
    );
  })

  return (
    <div className="w-7/12 h-full mx-auto">
      <Player
        ref={playerRef}
        width={'100%'}
        height={'100%'}
        preload={'auto'}
        src={videoUrl}
      >
        <BigPlayButton position="center" />

        <ControlBar>
          <ReplayControl seconds={10} order={1.1} />
          <ForwardControl seconds={30} order={1.2} />
          <CurrentTimeDisplay order={4.1} />
          <TimeDivider order={4.2} />
          <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
          <VolumeMenuButton enabled />
        </ControlBar>
      </Player>  </div>
  );
}
