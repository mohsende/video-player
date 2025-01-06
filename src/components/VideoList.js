import React, { useState } from 'react';
// import './VideoList.css';
import './VideoList.scss';


function VideoList({ videoList, handleVideoClick, handleDeleteVideo }) {
  
  return (<>
    <ul className='movie-list'>
      {videoList.map((video, index) => {
        const jsonVideo = JSON.stringify(video);
        var hasSub = jsonVideo.includes(`subtitle`); //Check for having subtitle
        // console.log(jsonVideo.includes(`subtitle`));
        return(
        <li key={index} className='movie-card'>
          <div className='movie-card-content'
            style={{
              backgroundImage: `url(${video.poster})`,
              // width: '150px',
              // height: '200px',
              // backgroundPosition: 'center',
              // backgroundRepeat: 'no-repeat',
              // backgroundSize: 'cover'
          }}>
            <span className='video-name' onClick={() => handleVideoClick(video.url)}>
              <p>{video.filename}</p>
              {hasSub && 
              <span className={hasSub ? 'is-sub' : undefined}><strong>Subtitle</strong></span>}
            </span>
            <button className='delete-btn' onClick={() => handleDeleteVideo(video.url)}>DELETE</button>
          </div>
        </li>
      )})}
    </ul>
  </>
  );
}

export default VideoList;
