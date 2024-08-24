import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
// import VideoJS from 'video.js';
// import Plyr from 'plyr-react';
// import 'video.js/dist/video-js.css';
// import 'plyr-react/plyr.css';
// import ShakaPlayer from './ShakaPlayer'; // کامپوننت جدید
// import './App.css';

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
    if (videoUrl && !videoList.includes(videoUrl)) {
      const updatedList = [...videoList, videoUrl];
      setVideoList(updatedList);
      setVideoUrl('');

      try {
        await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedList),
        });
      } catch (error) {
        console.error('Error saving links:', error);
      }
    }
  };

  const handleDeleteVideo = async (url) => {
    const updatedList = videoList.filter(video => video !== url);
    setVideoList(updatedList);

    try {
      await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
    } catch (error) {
      console.error('Error deleting link:', error);
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
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
        <button onClick={handleAddVideo}>Add Video</button>
      </div>

      {/* لیست ویدیوها */}
      <ul>
        {videoList.map((url, index) => (
          <li key={index}>
            <span onClick={() => handleVideoClick(url)}>{url}</span>
            <button className='deleteBtn' onClick={() => handleDeleteVideo(url)}>X</button>
          </li>
        ))}
      </ul>

      <div className='videoPlayers'>
        {currentVideo && (
          <div>
            <div className='players'>
              <div className="player-container">
                <h3>React Player</h3>
                <ReactPlayer url={currentVideo} controls />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
