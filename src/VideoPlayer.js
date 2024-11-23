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
        // {captionsArr.length > 0 &&
        //   <div>
        //     <span>Subtiles</span>
        //     {captionsArr.map((sub, index) => (
        //       <button className={selectedCaption === sub.src ? 'subBtn btnActive' : 'subBtn'}
        //         key={index}
        //         onClick={() => handleCaptionSelect(sub.src)}>
        //         {sub.src}
        //       </button>
        //     ))}
        //     <span style={{ 'color': 'white', 'fontSize': '.5rem' }}>{isSubSelected ? selectedCaption : 'nothing'}</span>
        //   </div>}
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
