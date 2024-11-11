import React, { useState, useEffect } from 'react';
import './App.css';
import './mediaQuery.css';
import InputSection from './InputSection';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import axios, * as others from 'axios';

const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';
const MYAPI_URL = 'https://www.omdbapi.com/?apikey=c3327b94&s=';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [screenSize, setScreenSize] = useState({width: window.innerWidth, height: window.innerHeight});
  const [captionsArr, setCaptions] = useState([]);
  const [showInputSection, setShowInputSection] = useState(false);
  const [showVideoList, setShowVideoList] = useState(true);

  useEffect(() => {
    fetchVideoList();
    setScreenSize({...screenSize, width: window.innerWidth, height: window.innerHeight});
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

  const handleDeleteVideo = async (url) => {
    const updatedList = videoList.filter(video => video.url !== url);
    setVideoList(updatedList);
    setCurrentVideo('');
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

  function handleShowInputSectionClick() {
    setShowInputSection(show => !show);
  }

  function handleShowVideoListClick() {
    setShowVideoList(show => !show);
  }

  return (
    <div className="App">
      <div className='screenSize' style={{ color: 'whitesmoke', textAlign: 'right', opacity: '0.3' }}><p>{screenSize.width}x{screenSize.height}</p></div>
      <div className='appContainer'>
        {/* <h1>MDe Player</h1> */}
        <button
          className='showInputSection'
          onClick={handleShowInputSectionClick}>
          {showInputSection ? 'Hide Input Movie' : 'Show Input Movie'}
        </button>
        {
          showInputSection &&
          <InputSection
            WORKER_URL={WORKER_URL}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            subtitleFile={subtitleFile}
            setSubtitleFile={setSubtitleFile}
            handleClearList={handleClearList}
            videoList={videoList}
            setVideoList={setVideoList}
            setShowInputSection={setShowInputSection}
          />
        }

        <button
          className='showVideoList'
          onClick={handleShowVideoListClick}>
          {showVideoList ? 'Hide Movie list' : 'Show Movie list'}
        </button>
        {
          showVideoList &&
          <VideoList
          videoList={videoList}
          handleVideoClick={handleVideoClick}
          handleDeleteVideo={handleDeleteVideo}
          />
        }
        {
          showVideoList &&
          <VideoPlayer
          currentVideo={currentVideo}
          captionsArr={captionsArr}
          />
        }
      </div>
    </div>
  );
}

export default App;
