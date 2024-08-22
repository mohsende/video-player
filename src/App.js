import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import VideoJS from 'video.js';
import Plyr from 'plyr-react';
import 'video.js/dist/video-js.css';
import 'plyr-react/plyr.css';
import ShakaPlayer from './ShakaPlayer'; // کامپوننت جدید
import './App.css';

// آدرس Worker شما
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

      {/* اینپوت برای اضافه کردن لینک جدید */}
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter video URL"
      />
      <button onClick={handleAddVideo}>Add Video</button>

      {/* لیست ویدیوها */}
      <ul>
        {videoList.map((url, index) => (
          <li key={index}>
            <span onClick={() => handleVideoClick(url)}>{url}</span>
            <button onClick={() => handleDeleteVideo(url)}>Delete</button>
          </li>
        ))}
      </ul>

      <div className='videoPlayers'>
        {currentVideo && (
          <>
            <div className='players'>
              {/* پلیر ReactPlayer */}
              <div className="player-container">
                <h3>React Player</h3>
                <ReactPlayer url={currentVideo} controls width="100%" height="200px" />
              </div>
            </div>
            <div className='players'>
              {/* پلیر VideoJS */}
              <div className="player-container">
                <h3>Video.js Player</h3>
                <div data-vjs-player>
                  <video
                    id="video-js"
                    className="video-js"
                    controls
                    preload="auto"
                    width="100%"
                    height="200px"
                  >
                    <source src={currentVideo} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
            <div className='players'>
              {/* پلیر Plyr */}
              <div className="player-container">
                <h3>Plyr Player</h3>
                <Plyr source={{ type: 'video', sources: [{ src: currentVideo, type: 'video/mp4' }] }} />
              </div>
            </div>
            <div className='players'>
              {/* پلیر Shaka */}
              <div className="player-container">
                <h3>Shaka Player</h3>
                <ShakaPlayer src={currentVideo} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
