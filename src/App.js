import React, { useState, useEffect } from 'react';
import './App.css';
import InputSection from './InputSection';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
// import GooglePanel from './GooglePanel';

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
  const [captionsArr, setCaptions] = useState([]);
  const [showInputSection, setShowInputSection] = useState(false);
  const [showVideoList, setShowVideoList] = useState(true);
  // const [showGoogle, setShowGoogle] = useState(false);
  // const [googleUrl, setGoogleUrl] = useState('https://www.google.com/search?igu=1');

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
    // setShowGoogle(false);
    
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

  // const handleGoogleClick = () => {
  //   setShowGoogle(true);
  // };

  // const handleBackButtonClick = () => {
  //   setShowGoogle(false);
  // };

  function handleShowInputSectionClick() {
    setShowInputSection(show => !show);
  }

  function handleShowVideoListClick() {
    setShowVideoList(show => !show);
  }

  // console.log(movieTitle);

  return (
    <div className="App">
      <div className='leftPanel'>
        <h1>MDe Player</h1>
        <button className='showInputSection' onClick={handleShowInputSectionClick}>{showInputSection ? 'Hide' : 'Show Input section'}</button>
        {showInputSection && <InputSection
          WORKER_URL={WORKER_URL}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          subtitleFile={subtitleFile}
          setSubtitleFile={setSubtitleFile}
          handleClearList={handleClearList}
          videoList={videoList}
          setVideoList={setVideoList}
          setShowInputSection={setShowInputSection}
        />}
        <button className='showVideoList' onClick={handleShowVideoListClick}>{showVideoList ? 'Hide' : 'Show Video list'}</button>
        {showVideoList && <VideoList
          videoList={videoList}
          handleVideoClick={handleVideoClick}
          handleDeleteVideo={handleDeleteVideo}
        />}
        {showVideoList && <VideoPlayer
          currentVideo={currentVideo}
          captionsArr={captionsArr}
        />}
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
