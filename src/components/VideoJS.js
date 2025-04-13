import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import "videojs-vtt-thumbnails";
// import "../styles/videojs-vtt-thumbnails";
// import '../styles/videojs-netflix.css';


export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady, captions } = props;

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);
      const player = playerRef.current = videojs(videoElement, options, () => {
        // videojs.log('player is ready');
        onReady && onReady(player);
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
      
      captions.forEach((track) => {
        player.addRemoteTextTrack({...track, mode: 'showing'});
      });
    }
  }, [options, videoRef]);
    
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
      <h6 style={{color: 'gray', opacity: '0.5', textAlign: 'right'}}>by video.js</h6>
    </div>
  );
}

export default VideoJS;