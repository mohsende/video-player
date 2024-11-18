import React, { useState } from 'react';
import './VideoList.css';


function VideoList({ videoList, handleVideoClick, handleDeleteVideo }) {

  return (<>
  {/* <ul className='ulTest'>
    <li className='rel'>
      <div className='abs'>
        <span><p>Name</p></span>
        <button>click</button>
      </div>
    </li>
    <li className='rel'>
      <div className='abs'>
        <span><p>Name1</p></span>
        <button>click1</button>
      </div>
    </li>
    <li className='rel'>
      <div className='abs'>
        <span><p>Name2</p></span>
        <button>click2</button>
      </div>
    </li>
    <li className='rel'>
      <div className='abs'>
        <span><p>Name3</p></span>
        <button>click3</button>
      </div>
    </li>
    <li className='rel'>
      <div className='abs'>
        <span><p>Name4</p></span>
        <button>click4</button>
      </div>
    </li>
  </ul> */}
    <ul className='movieList'>
      {videoList.map((video, index) => (
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
              {video.subtitle1 && 
                <span className='isSub'><strong>Subtitle</strong></span>}
            </span>
            <button className='deleteBtn' onClick={() => handleDeleteVideo(video.url)}>DELETE</button>
          </div>
        </li>
      ))}
    </ul>
  </>
  );
}

export default VideoList;
