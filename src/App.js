import React, { useState, useEffect } from 'react';
import './App.css';
import './mediaQuery.css';
import InputSection from './InputSection';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import axios, * as others from 'axios';
import * as rdd from 'react-device-detect';

const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';
const MYAPI_URL = 'https://www.omdbapi.com/?apikey=c3327b94&s=';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [subtitleFile, setSubtitleFile] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({});
  const [captionsArr, setCaptions] = useState([]);
  const [captionsArrTest, setCaptionsTest] = useState([]);
  const [showInputSection, setShowInputSection] = useState(false);
  const [showVideoList, setShowVideoList] = useState(true);

  useEffect(() => {
    fetchVideoList();
    setDeviceInfo({...deviceInfo, 
      width: window.innerWidth, 
      height: window.innerHeight,
      deviceType: rdd.deviceType,
      browserName: rdd.browserName,
      mobileMode: rdd.mobileModel,
      isSmartTV: rdd.isSmartTV,
    });
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

  const handleVideoClick = async(url) => {
    const video = videoList.find(video => video.url === url);
    
    // TEST for Proxy video
    // Generate proxy URL
    const proxyUrl = `${WORKER_URL}proxyVideo/${encodeURIComponent(url)}`;
    // console.log('proxyUrl:', proxyUrl.split('proxyVideo/').pop());

    // Find subtitles
    const subtitles = Object.keys(video)
      .filter(key => key.startsWith("subtitle"))
      .map(key => video[key]);

    // Create subtitle tracks
    const newSubs = subtitles.map((subtitle, index) => ({
      label: `Fa ${subtitle.split('/').pop().split('-subtitle').pop().split('.')[0]}`,
      kind: 'subtitles',
      src: subtitle,
      default: index === 0, // Set the first subtitle as default
    }));

    // End TEST

    // setCurrentVideo(video.url);
    
    setCurrentVideo(proxyUrl);
    setCaptions(newSubs);

  };

  const handleDeleteVideo = async (url) => {
    if (window.confirm("Are you sure to delete ?")) {
      const updatedList = videoList.filter(video => video.url !== url);
      setVideoList(updatedList);
      setCurrentVideo('');
      // console.log(JSON.stringify({ url }));
      try {
        await fetch(WORKER_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      } catch (error) {
        console.error('Error deleting link:', error);
      }
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

  function handleShowInputSectionClick() {
    setShowInputSection(show => !show);
  }

  function handleShowVideoListClick() {
    setShowVideoList(show => !show);
  }
  
  return (
    <div className="App">
      <div className='screenSize'>
        <p>
          Device: [{rdd.deviceType} / {rdd.browserName}{rdd.isSmartTV && ' / is SmartTV'}{rdd.isDesktop && ' /  Desktop'}{rdd.isBrowser && ' /  isBrowser'}] - 
          Screen Size: {deviceInfo.width}x{deviceInfo.height}
        </p>
        
      </div>
      {/* This section is for getting my TV info for setting CORS */}
      <pre style={{textWrap: 'wrap', color: 'whitesmoke', opacity: '0.3'}}>
        {JSON.stringify(rdd, null, 2)}
      </pre>
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
