import React, { useState, useEffect } from 'react';
import './App.css';
import InputSection from './InputSection';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import GooglePanel from './GooglePanel';

const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [captionsArr, setCaptions] = useState([]);
  const [showGoogle, setShowGoogle] = useState(false);
  const [googleUrl, setGoogleUrl] = useState('https://www.google.com/search?igu=1');

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
    const newUrl = `https://anym3u8player.com/mp4-player/?url=${url}`;
    window.open(newUrl, '_blank');
    const video = videoList.find(video => video.url === url);
    setCurrentVideo(url);
    setShowGoogle(false);

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

  const handleGoogleClick = () => {
    setShowGoogle(true);
  };

  const handleBackButtonClick = () => {
    setShowGoogle(false);
  };

  return (
    <div className="App">
      <div className='leftPanel'>
        <h1>Video Player</h1>
        <InputSection
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          setSubtitleFile={setSubtitleFile}
          handleAddVideo={handleAddVideo}
          handleClearList={handleClearList}
        />
        <VideoList
          videoList={videoList}
          handleVideoClick={handleVideoClick}
          handleDeleteVideo={handleDeleteVideo}
        />
        <VideoPlayer
          currentVideo={currentVideo}
          captionsArr={captionsArr}
        />
      </div>
      {/* <GooglePanel
        showGoogle={showGoogle}
        googleUrl={googleUrl}
        handleGoogleClick={handleGoogleClick}
        handleBackButtonClick={handleBackButtonClick}
      /> */}
    </div>
  );
}

export default App;
