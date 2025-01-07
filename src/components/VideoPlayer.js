import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import '../styles/VideoPlayer.scss'

function VideoPlayer({currentVideo, captionsArr}) {
  // const [selectedCaption, setSelectedCaption] = useState([]);
  // const [isSubSelected, setIsSubSelected] = useState(false);

  // useEffect(() => {
  //   setIsSubSelected(false);
  //   setSelectedCaption([]);
  //   // console.log('useEffect');
  // }, [captionsArr]);

  // function handleCaptionSelect(src) {
  //   changeCaption(src);
  //   console.log('Clicked:', selectedCaption);
  // };

  // function changeCaption(src) {
  //   setSelectedCaption(src);
  //   setIsSubSelected(true);
  // };

  return (
    <div className='video-players'>
      {currentVideo &&
        <div className='player'>
          <div className="react-player-wrapper">
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
          </div>
        </div>}
    </div>
  );
}

export default VideoPlayer;
