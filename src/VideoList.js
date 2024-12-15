import React, { useState } from 'react';
import './VideoList.css';


function VideoList({ videoList, handleVideoClick, handleDeleteVideo }) {
  
  return (<>
    <ul className='movieList'>
      {videoList.map((video, index) => {
        const jsonVideo = JSON.stringify(video);
        var hasSub = jsonVideo.includes(`subtitle`); //Check for having subtitle
        // console.log(jsonVideo.includes(`subtitle`));
        return(
        <li key={index} className='movieCard'>
          <div className='movieCardContent'
            style={{
              backgroundImage: `url(${video.poster})`,
              // width: '150px',
              // height: '200px',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
          }}>
            <span className='videoName' onClick={() => handleVideoClick(video.url)}>
              <p>{video.filename}</p>
                {hasSub && 
                <span className={hasSub ? 'isSub' : undefined}><strong>Subtitle</strong></span>}
            </span>
            <button className='deleteBtn' onClick={() => handleDeleteVideo(video.url)}>DELETE</button>
          </div>
        </li>
      )})}
    </ul>
  </>
  );
}

export default VideoList;
