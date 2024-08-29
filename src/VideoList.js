import React from 'react';
import './VideoList.css';


function VideoList({ videoList, handleVideoClick, handleDeleteVideo }) {
  return (
    <ul className='movieList'>
      {videoList.map((video, index) => (
        <li key={index} className='movieCard'>
          <img src='/movie-icon-2.png' alt='' onClick={() => handleVideoClick(video.url)} />
          <span className='videoName' onClick={() => handleVideoClick(video.url)}>{video.name}</span>
          <button className='deleteBtn' onClick={() => handleDeleteVideo(video.url)}>X</button>
        </li>
      ))}
    </ul>
  );
}

export default VideoList;
