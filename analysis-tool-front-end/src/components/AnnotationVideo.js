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
  BigPlayButton,
} from 'video-react';
import 'video-react/dist/video-react.css';

export default function AnnotationVideo(props) {
  const {
    videoUrl,
    seekTime,
    seekTimeChanged,
    updateCurrentVideoTime,
    updateCurrentPausedState,
    videoPaused,
  } = props;
  const playerRef = useRef();

  const handleStateChange = (state, prevState) => {
    updateCurrentVideoTime(state.currentTime);
    updateCurrentPausedState(state.paused);
  };

  playerRef.current?.subscribeToStateChange(handleStateChange);

  useEffect(() => {
    if (videoPaused) {
      playerRef.current.actions.pause();
    } else if (videoPaused !== null) {
      playerRef.current.actions.seek(seekTime);
      playerRef.current.actions.play();
    }
    // overload video player full screen toggle to disable fullscreen
    playerRef.current.actions.toggleFullscreen = () => {};
  }, [seekTime, videoPaused, seekTimeChanged]);

  return (
    <div className="w-full h-full">
      <Player
        ref={playerRef}
        fluid={false}
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
      </Player>
    </div>
  );
}
