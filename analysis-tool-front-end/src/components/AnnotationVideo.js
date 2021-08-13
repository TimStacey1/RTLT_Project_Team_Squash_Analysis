import React, { useRef, useEffect } from 'react';
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
  BigPlayButton
} from 'video-react';
import 'video-react/dist/video-react.css';
import test1 from '../assets/test1.mp4';

export default function AnnotationVideo() {
  const playerRef = useRef();

  function handleStateChange(state, prevState) {}

  useEffect(() => {
    playerRef.current.subscribeToStateChange(handleStateChange);
    // overload video player full screen toggle to disable fullscreen
    playerRef.current.actions.toggleFullscreen = () => {};
  }, []);

  return (
    <div className="w-full h-full">
      <Player ref={playerRef} fluid={false} width={'100%'} height={'100%'} preload={'auto'}>
        <source src={test1} />

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
  );
}
