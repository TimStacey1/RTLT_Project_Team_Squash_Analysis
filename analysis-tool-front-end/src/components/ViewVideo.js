import { React, useState, useEffect } from 'react';
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

export default function ViewVideo({ baseUrl }) {
  const matchId = window.location.pathname.substring(12);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    setVideoUrl(baseUrl + '/video/' + matchId + '/stream');
  }, [baseUrl, matchId]);

  return (
    <div className="w-full h-desktop">
      <div className="px-3 w-full h-full">
        <Player preload={'auto'} fluid={false} height={'100%'} src={videoUrl}>
          <BigPlayButton position="center" />

          <ControlBar>
            <ReplayControl seconds={10} order={1.1} />
            <ForwardControl seconds={30} order={1.2} />
            <CurrentTimeDisplay order={4.1} />
            <TimeDivider order={4.2} />
            <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
            <VolumeMenuButton enabled />
          </ControlBar>
        </Player>
      </div>
    </div>
  );
}
