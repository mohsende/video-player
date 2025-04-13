import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import '../styles/VideoPlayer.scss'
import VideoJS from './VideoJS';
import { preload } from 'react-dom';

function VideoPlayer({currentVideo, captionsArr, isTV}) {

  const [captions, setCaptions] = useState([])

  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current) {
      clearTracks();
      createSubtitle();
    }
    // console.log(captionsArr);
  }, [currentVideo, captionsArr]);
  
  // Remove the previous tracks
  function clearTracks() {
    const videoElement = videoRef.current;
    const tracks = videoElement.getElementsByTagName('track');
    for (let i = tracks.length - 1; i >= 0; i--) {
      videoElement.removeChild(tracks[i]);
    }
  }

  async function createSubtitle() {
    if (videoRef.current !== null) {
      const videoElement = videoRef.current;
      const subtitlePromises = captionsArr.map(async (sub) => {
        const subtitle = await subtitleToBlob(sub.src);
        // console.log('subtitle', subtitle);
        const caption = {
          kind: sub.kind,
          srclang: 'fa',
          label: sub.label,
          src: subtitle
        };
        setCaptions([...captions, caption]);
        const trackElement = document.createElement('track');
        trackElement.kind = sub.kind;
        trackElement.src = subtitle;
        trackElement.default = sub.default;
        trackElement.label = sub.label;
        videoElement.appendChild(trackElement);
      });
      await Promise.all(subtitlePromises);
    } else {
      const subtitlePromises = captionsArr.map(async (sub) => {
        const subtitle = await subtitleToBlob(sub.src);
        // console.log('subtitle', subtitle);
        const caption = {
          kind: sub.kind,
          label: sub.label,
          src: subtitle
        };
        setCaptions([...captions, caption]);
      });
      await Promise.all(subtitlePromises);
    }
  }

  async function subtitleToBlob(url) {
    try {
      const response = await fetch(url);
      const subtitleContent = await response.text();
      const trackElement = document.getElementById('subtitleTrack');
      const blob = new Blob([subtitleContent], { type: 'text/vtt' });
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } catch (error) {
      console.error('Error fetching subtitle:', error);
    }
  }

  const videoJsOptions = {
    // autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    disablePictureInPicture: true,
    preload: 'metadata',
    sources: [{
      src: currentVideo,
      type: 'video/mp4'
    }],
    controlBar: {
      skipButtons: {
        backward: 10,
        forward: 10
      }
    }
  }

  // const captionOption = [{
  //   kind: 'captions',
  //   srclang: 'fa',
  //   label: 'Farsi 1',
  //   src: 'sub-1.vtt',
  //   mode: 'showing'
  // }, {
  //     kind: 'captions',
  //     srclang: 'fa',
  //     label: 'Farsi 2',
  //     src: 'sub-2.vtt',
  //   },];

  const playerRef = React.useRef(null);
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    createSubtitle();
    player.on('waiting', () => {
      // console.log('Player is waiting');
    });

    player.on('dispose', () => {
      // console.log('Player will dispose');
    });
  };

  return (
    <div className='video-players'>
        {currentVideo &&
          <div className='player'>
            <div className="react-player-wrapper">
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} captions={captions} />

              {
              // isTV ?
              //   <video
              //     ref={videoRef}
              //     key={currentVideo}
              //     controls
              //     width='90%'
              //     preload="auto"
              //   >
              //     <source src={currentVideo} />
              //     {/* { captionsArr.length > 0 &&
              //       captionsArr.map((sub, index) => (<track key={index} label={sub.label} kind={sub.kind} src={subtitleToBlob(sub.src)} default={sub.default} />)) } 
              //     */}
              //   </video>
              //   :
              //   <ReactPlayer
              //     className='react-player'
              //     url={currentVideo}
              //     config={{
              //       file: {
              //         tracks: captionsArr,
              //       },
              //     }}
              //     width='100%' height='auto'
              //     // style={{ minWidth: '375px' }}
              //     controls
              //   />
              }
            </div>
        </div>}
      </div>
  );
}

export default VideoPlayer;
