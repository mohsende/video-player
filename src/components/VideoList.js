import React, { useState } from 'react';
import '../styles/VideoList.scss';


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
              }} 
              onClick={() => handleVideoClick(video.url)}>
            <span className='video-name'>
              <p>{video.filename}</p>
              {hasSub && 
              <span className={hasSub ? 'is-sub' : undefined}>Subtitle</span>}
            </span>
            <button className='delete-btn' onClick={(event) => handleDeleteVideo(event, video.url)}>DELETE</button>
          </div>
        </li>
      )})}
    </ul>
  </>
  );
}

export default VideoList;
