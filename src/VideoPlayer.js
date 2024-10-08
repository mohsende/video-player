import React from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css'

function VideoPlayer({ currentVideo, captionsArr }) {
  return (
    <div className='videoPlayers'>
      {currentVideo && (
        <div className='player'>
          <div className="reactPlayer-wrapper">
            <ReactPlayer
              className='reactPlayer'
              url={currentVideo}
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous',
                  },
                  tracks: captionsArr,
                },
              }}
              width='60%' height='auto'
              style={{ minWidth: '440px' }}
              controls
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
