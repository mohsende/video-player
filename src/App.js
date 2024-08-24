import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

// Worker Address
const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');

  const fetchVideoList = async () => {
    try {
      const response = await fetch(WORKER_URL);
      const data = await response.json();
      setVideoList(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  useEffect(() => {
    fetchVideoList();
  }, []);

  const handleAddVideo = async () => {
    if (videoUrl && !videoList.some(video => video.url === videoUrl)) {
      const fileName = videoUrl.split('/').pop();
      const newVideo = { url: videoUrl, name: fileName };
      const updatedList = [...videoList, newVideo];
      setVideoList(updatedList);
      setVideoUrl('');

      try {
        await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVideo),
        });
      } catch (error) {
        console.error('Error saving links:', error);
      }
    }
  };

  const handleDeleteVideo = async (url) => {
    const updatedList = videoList.filter(video => video.url !== url);
    setVideoList(updatedList);

    try {
      await fetch(WORKER_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleClearList = async () => {
    setVideoList([]);

    try {
      await fetch(WORKER_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true }),
      });
    } catch (error) {
      console.error('Error clearing list:', error);
    }
  };

  const handleVideoClick = (url) => {
    setCurrentVideo(url);
  };

  return (
    <div className="App">
      <h1>Video Players Test</h1>
      <div className='inputSection'>
        <input
          type="text"
          className='videoUrl'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
        <button className='addBtn' onClick={handleAddVideo}>+</button>
        <button className='clearBtn' onClick={handleClearList}>Clear All</button>
      </div>

      <ul className='movieList'>
        {videoList.map((video, index) => (
          <li key={index} className='movieCard'>
            <span className='videoName' onClick={() => handleVideoClick(video.url)}>{video.name}</span>
            <button className='deleteBtn' onClick={() => handleDeleteVideo(video.url)}>X</button>
          </li>
        ))}
      </ul>

      <div className='videoPlayers'>
        {currentVideo && (
          <div className='player'>
            <h3>React Player</h3>
            <div className="reactPlayer-wrapper">
              <ReactPlayer className='reactPlayer' url={currentVideo} width='80%' height='auto' style={{minWidth: '440px'}} controls />
            </div>
          </div>
        )} 
      </div>
    </div>
  );
}

export default App;
