import React, { useState, useEffect } from 'react';
import '../styles/App.scss';
import InputSection from './InputSection';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import * as rdd from 'react-device-detect';
import Skaleton from './Skaleton';
import Sidebar from './Sidebar';

const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';
const MYAPI_URL = 'https://www.omdbapi.com/?apikey=c3327b94&s=';

function App() {
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({});
  const [captionsArr, setCaptions] = useState([]);
  const [showInputSection, setShowInputSection] = useState(false);
  const [showVideoList, setShowVideoList] = useState(true);
  const [isTV, setIsTV] = useState(rdd.isSmartTV);

  useEffect(() => {
    setDeviceInfo({...deviceInfo,
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: rdd.deviceType,
      browserName: rdd.browserName,
      mobileMode: rdd.mobileModel,
      isSmartTV: rdd.isSmartTV
    });

    const updateCSSVariable = () => {
      const deviceWidth = rdd.isMobile ? window.innerWidth : window.innerWidth;
      const deviceHeight = rdd.isMobile ? window.innerWidth : window.innerHeight;
      if (deviceWidth < 400) {
        document.documentElement.style.setProperty("--find-movie-width", `${deviceWidth - 20}px`);
        document.documentElement.style.setProperty("--find-movie-height", `${deviceHeight - 20}px`);
      } else {
        // document.documentElement.style.setProperty("--find-movie-width", "350px");
      }
    };

    // تنظیم مقدار اولیه
    updateCSSVariable();
    
    // گوش دادن به تغییر سایز صفحه
    window.addEventListener("resize", updateCSSVariable);
    return () => window.removeEventListener("resize", updateCSSVariable);


  }, []);

  useEffect(() => {

  }, [currentVideo])

  // const handleVideoClick = async (url) => {
  //   const video = videoList.find(video => video.url === url);

  //   // Generate proxy URL
  //   const proxyUrl = `${WORKER_URL}proxyVideo/${encodeURIComponent(url)}`;

  //   // Find subtitles
  //   const subtitles = Object.keys(video)
  //     .filter(key => key.startsWith("subtitle"))
  //     .map(key => video[key]);

  //   // Create subtitle tracks
  //   const newSubs = subtitles.map((subtitle, index) => ({
  //     label: `Fa ${subtitle.split('/').pop().split('-subtitle').pop().split('.')[0]}`,
  //     kind: 'subtitles',
  //     src: subtitle,
  //     default: index === 0, // Set the first subtitle as default
  //   }));


  //   // Bypass CORS if using TV otherwise use Cloudflare proxy if using browser
  //   if (isTV) {
  //     setCurrentVideo(video.url);
  //   } else {
  //     setCurrentVideo(proxyUrl);
  //   }

  //   setCaptions(newSubs);
  // };

  // const handleDeleteVideo = async (event, url) => {
  //   event.stopPropagation();
  //   if (window.confirm("Are you sure to delete ?")) {
  //     setCurrentVideo('');
  //     try {
  //       await fetch(WORKER_URL, {
  //         method: 'DELETE',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ url }),
  //       });
  //       const updatedList = videoList.filter(video => video.url !== url);
  //       setVideoList(updatedList);
  //     } catch (error) {
  //       alert(`Fail to delete:\n ${url}`)
  //       console.error('Error deleting link:', error);
  //     }
  //   }
  // };

  // const handleClearList = async () => {
  //   setVideoList([]);

  //   try {
  //     await fetch(WORKER_URL, {
  //       method: 'DELETE',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ clearAll: true }),
  //     });
  //   } catch (error) {
  //     console.error('Error clearing list:', error);
  //   }
  // };

  // function handleShowInputSectionClick() {
  //   setShowInputSection(show => !show);
  // }

  // function handleShowVideoListClick() {
  //   setShowVideoList(show => !show);
  // }

  

  // console.log('isTV: ',isTV);

  // console.log(currentVideo);
  
  return (
    <div className="App">
      {/* Temporary
      <div className='screen-size'>
        <span>Device: {rdd.deviceType}|{rdd.browserName}{rdd.isSmartTV && '|is SmartTV'}{rdd.isDesktop && '|Desktop'}{rdd.isBrowser && '|isBrowser'}|
        </span>
        <span>Screen Size: {window.innerWidth}x{window.innerHeight}</span>
      </div>
      */}
      
      {/* This section is for getting my TV info for setting CORS */}
      {/* <pre style={{textWrap: 'wrap', color: 'whitesmoke', opacity: '0.3'}}>
        {JSON.stringify(rdd, null, 2)}
      </pre> */}
      <div className='main-container'>
        <Sidebar 
          setShowInputSection={setShowInputSection} 
          setShowVideoList={setShowVideoList}
        />
        <div className='app-container'>
        {/* <h1>MDe Player</h1> */}
        <button
          className='show-input-section'
          onClick={() => setShowInputSection(show => !show)}>
          {showInputSection ? 'Hide Input Movie' : 'Show Input Movie'}
        </button>
        {
          showInputSection &&
          <InputSection
            WORKER_URL={WORKER_URL}
            videoList={videoList}
            setVideoList={setVideoList}
            setShowInputSection={setShowInputSection}
          />
        }

        <button
          className='show-video-list'
          onClick={() => setShowVideoList(show => !show)}>
          {showVideoList ? 'Hide Movie list' : 'Show Movie list'}
        </button>
        {
          showVideoList &&
          <VideoList
            WORKER_URL={WORKER_URL}
            setCaptions={setCaptions}
            setCurrentVideo={setCurrentVideo}
            isTV={isTV}
          />
        }
        <div className='TV'>
          <input id='TV' type='checkbox' checked={isTV} onChange={(e) => setIsTV(e.target.checked)} />
          <label htmlFor='TV' style={{ color: isTV ? '#ffff00' : '#555', fontWeight: 'bold' }}>Watching in TV</label>
        </div>
        {/* {
          (showVideoList && isTV) && 
          <video 
            controls
            width='90%'
            preload="auto" 
          >
            <source src={currentVideo} />
          </video>
        } */}
        {
          showVideoList &&
          <VideoPlayer
            currentVideo={currentVideo}
            captionsArr={captionsArr}
            isTV={isTV}
          />
        }
        </div>
      </div>
    </div>
  );
}

export default App;
