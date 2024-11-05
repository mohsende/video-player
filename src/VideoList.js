import React, { useState } from 'react';
import './VideoList.css';


function VideoList({ videoList, handleVideoClick, handleDeleteVideo }) {

  return (
    <ul className='movieList'>
      {videoList.map((video, index) => (
        <li key={index} className='movieCard'>
          <div className='movieCardContent'
            style={{
              backgroundImage: `url(${video.poster})`,
              width: '150px',
              height: '200px',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
          }}>
            <span className='videoName' onClick={() => handleVideoClick(video.url)}>
              <p>{video.filename}</p>
              {video.subtitle && 
              <span>'Sub'</span>}
            </span>
            <button className='deleteBtn' onClick={() => handleDeleteVideo(video.url)}>DELETE</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default VideoList;
