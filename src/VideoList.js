import React, { useState } from 'react';
import './VideoList.css';


function VideoList({ videoList, handleVideoClick, handleDeleteVideo }) {
  
  // const apiUrl = 'https://www.omdbapi.com/?apikey=c3327b94&t=';
  // const [findMovies, setFindMovies] = useState([]);

  // async function searchMovie(name) {
  //   const apiUrlMovie = apiUrl + name;
  //   try {
  //     const response = await fetch(apiUrlMovie);
  //     const data = await response.json();
  //     setFindMovies(data.Search)
  //   } catch (error) {
  //     console.error('Error fetching links:', error);
  //   }
  // };


  return (
    <ul className='movieList'>
      {videoList.map((video, index) => (
        <li key={index} className='movieCard'>
          <div className='movieCardContent' onClick={() => handleVideoClick(video.url)} style={{
            backgroundImage: `url(${video.poster})`,
            width: '150px',
            height: '200px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}>
            <span className='videoName' onClick={() => handleVideoClick(video.url)}>{video.filename}</span>
            <button className='deleteBtn' onClick={() => handleDeleteVideo(video.url)}>DELETE</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default VideoList;
