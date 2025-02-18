import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import '../styles/VideoPlayer.scss'

function VideoPlayer({currentVideo, captionsArr, isTV}) {
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
  console.log(captionsArr);

  return (
    <div className='video-players'>
      {currentVideo &&
        <div className='player'>
          <div className="react-player-wrapper">
          {
            isTV ?
            <video
              controls
              width='90%'
              preload="auto"
            >
              <source src={currentVideo} />
              { captionsArr.length > 0 &&
                captionsArr.map((sub, index) => (<track crossOrigin='none' key={index} label={sub.label} kind={sub.kind} src={sub.src} default={sub.default} />))
              }
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
