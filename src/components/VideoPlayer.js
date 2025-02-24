import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import '../styles/VideoPlayer.scss'

function VideoPlayer({currentVideo, captionsArr, isTV}) {

  const videoRef = useRef(null);

  // useEffect(() => {
  //   if (videoRef.current && captionsArr.length > 0) {
  //     clearTracks();
  //     createSubtitle();
  //   }
  // }, [captionsArr])

  useEffect(() => {
    if (videoRef.current) {
      clearTracks();
      createSubtitle();
    }
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
    const videoElement = videoRef.current;
    const subtitlePromises = captionsArr.map(async (sub) => {
      const subtitle = await subtitleToBlob(sub.src);
      const trackElement = document.createElement('track');
      trackElement.kind = sub.kind;
      trackElement.src = subtitle;
      trackElement.default = sub.default;
      trackElement.label = sub.label;
      videoElement.appendChild(trackElement);
    });
    await Promise.all(subtitlePromises);
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

  // console.log(captionsArr);

  return (
    <div className='video-players'>
      {currentVideo &&
        <div className='player'>
          <div className="react-player-wrapper">
          {
            isTV ?
            <video
                  ref={videoRef}
                  key={currentVideo}
              controls
              width='90%'
              preload="auto"
            >
              <source src={currentVideo} />
                  {/* { captionsArr.length > 0 &&
                    captionsArr.map((sub, index) => (<track key={index} label={sub.label} kind={sub.kind} src={subtitleToBlob(sub.src)} default={sub.default} />))
              } */}
            </video> 
            :
            <ReactPlayer
              className='react-player'
              url={currentVideo}
              config={{
                file: {
                  attributes: {
                    crossOrigin: '',
                  },
                  tracks: captionsArr,
                },
              }}
              width='100%' height='auto'
              style={{ minWidth: '375px' }}
              controls
            />
          }
          </div>
        </div>}
    </div>
  );
}

export default VideoPlayer;
