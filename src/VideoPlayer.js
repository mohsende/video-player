import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css'

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
    <div className='videoPlayers'>
      {currentVideo &&
        <div className='player'>
          <div className="reactPlayer-wrapper">
            <ReactPlayer
              className='reactPlayer'
                url={currentVideo}
              config={{
                file: {
                  attributes: {
                    crossOrigin: '',
                  },
                    tracks: captionsArr,
                },
              }}
              width='70%' height='auto'
              style={{ minWidth: '370px' }}
              controls
            />
          </div>
        </div>}
    </div>
  );
}

export default VideoPlayer;
