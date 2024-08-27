import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [captionsArr, setCaptions] = useState([]);

  useEffect(() => {
    fetchVideoList();
  }, []);

  const fetchVideoList = async () => {
    try {
      const response = await fetch(WORKER_URL);
      const data = await response.json();
      setVideoList(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleAddVideo = async () => {
    if (videoUrl && !videoList.some(video => video.url === videoUrl)) {
      const fileName = videoUrl.split('/').pop();
      const newVideo = { url: videoUrl, name: fileName };

      const formData = new FormData();
      formData.append('videoData', JSON.stringify(newVideo));
      if (subtitleFile) {
        formData.append('subtitle', subtitleFile);
      }

      try {
        await fetch(WORKER_URL, {
          method: 'POST',
          body: formData,
        });

        const updatedList = [...videoList, newVideo];
        setVideoList(updatedList);
        setVideoUrl('');
        setSubtitleFile(null);
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
    const video = videoList.find(video => video.url === url);
    setCurrentVideo(url);

    if (video.subtitle) {
      setCaptions([
        {
          kind: 'subtitles',
          src: video.subtitle,
          srcLang: 'fa',
          default: true,
        }
      ]);
    } else {
      setCaptions([]);
    }
  };

  return (
    <div className="App">
      <h1>Video Player</h1>
      <div className='inputSection'>
        <div className='input'>
        <input
          type="text"
          className='videoUrl'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
        <input
          type="file"
          id='fileUpload'
          accept=".vtt"
          onChange={(e) => setSubtitleFile(e.target.files[0])}
        />
        </div>
        <button className='addBtn' onClick={handleAddVideo}>+</button>
        <button className='clearBtn' onClick={handleClearList}>-</button>
      </div>

      <ul className='movieList'>
        {videoList.map((video, index) => (
          <li key={index} className='movieCard'>
            <img src='/movie-icon-2.png' alt='' onClick={() => handleVideoClick(video.url)}></img>
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
              <ReactPlayer
                className='reactPlayer'
                url={currentVideo}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: 'anonymous',
                    },
                    tracks: captionsArr,
                  },
                }}
                width='60%' height='auto'
                style={{ minWidth: '440px' }}
                controls />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
