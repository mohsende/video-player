import React, { useState, useEffect } from 'react';
import '../styles/App.scss';
import InputSection from './InputSection';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import * as rdd from 'react-device-detect';

const WORKER_URL = 'https://videolinks.bugatichapi.workers.dev/';
const MYAPI_URL = 'https://www.omdbapi.com/?apikey=c3327b94&s=';

function App() {
  const [openSubtitle, setOpenSubtitle] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({});
  const [captionsArr, setCaptions] = useState([]);
  const [showInputSection, setShowInputSection] = useState(!rdd.isSmartTV);
  const [showVideoList, setShowVideoList] = useState(rdd.isSmartTV);
  const [isTV, setIsTV] = useState(rdd.isSmartTV);

  useEffect(() => {

    fetchVideoList();
    setDeviceInfo({
      ...deviceInfo,
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: rdd.deviceType,
      browserName: rdd.browserName,
      mobileMode: rdd.mobileModel,
      isSmartTV: rdd.isSmartTV,
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

  const fetchVideoList = async () => {
    try {
      const response = await fetch(WORKER_URL);
      const data = await response.json();
      setVideoList(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleVideoClick = async (url) => {
    const video = videoList.find(video => video.url === url);

    // Generate proxy URL
    const proxyUrl = `${WORKER_URL}proxyVideo/${encodeURIComponent(url)}`;

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


    // Bypass CORS if using TV otherwise use Cloudflare proxy if using browser
    if (isTV) {
      setCurrentVideo(video.url);
    } else {
      setCurrentVideo(proxyUrl);
    }

    setCaptions(newSubs);
  };

  const handleDeleteVideo = async (event, url) => {
    event.stopPropagation();
    if (window.confirm("Are you sure to delete ?")) {
      setCurrentVideo('');
      try {
        await fetch(WORKER_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const updatedList = videoList.filter(video => video.url !== url);
        setVideoList(updatedList);
      } catch (error) {
        alert(`Fail to delete:\n ${url}`)
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

  async function searchOpenSubtitles(movie) {
    var url = `${WORKER_URL}searchSubtitle?movie=${movie}`;
    if (parseInt(movie)) {
      const imdb_id = parseInt(movie);
      url = `${WORKER_URL}searchSubtitle?imdb_id=${imdb_id}`;
    }

    /* 
      attributes.feature_details: 
      {
        feature_id: 1783327
        feature_type: "Movie" *
        imdb_id: 20452218
        movie_name: "2023 - The Deep Dark"
        title: "The Deep Dark"
        tmdb_id: 976830
        year: 2023
      }

      {
        feature_id: 2203588
        feature_type: "Tvshow"  *
        imdb_id: 29363690
        movie_name: "2024 - Dark Night and Dawn"
        title: "Dark Night and Dawn"
        tmdb_id: 248818
        year: 2024
      }

      {
        episode_number: 1  *
        feature_id: 204334
        feature_type: "Episode"  *
        imdb_id: 3256392
        movie_name: "Teen Wolf - S04E01  The Dark Moon"
        parent_feature_id: 11234
        parent_imdb_id: 1567432
        parent_title: "Teen Wolf"  *
        parent_tmdb_id: 34524
        season_number: 4  *
        title: "The Dark Moon"
        tmdb_id: 990382
        year: 2014
      }

    */


    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('data.total_pages: ', data.total_pages);
      console.log('data.total_count: ', data.total_count);
      console.log('movie: ', movie.toLowerCase());
      data.data.map(item => {
        // const movieName = item.attributes.feature_details.parent_title ?? '';
        // if (movieName.toLowerCase() === movie.toLowerCase())
        { console.log(item); }
      })
      return (data.data);
    } catch (error) {
      console.error(error);
      return ([error]);
    }
  }

  async function downloadOpenSubtitles(file_id) {
    var url = `${WORKER_URL}downloadSubtitle?file_id=${file_id}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
      return (data);
    } catch (error) {
      console.error(error);
      return ([error]);
    }

  }

  const urls = [
    'https://s4.irdanlod.ir/files/Serial/T/Tomorrow/S01/Tomorrow.S01E01.720p.Farsi.Subbed.mkv',
    'https://upmediaa.upera.tv/3007344-0-720.mp4?ref=7wIA',
    'https://dlmoovie.ir/content/download/c6627fc4-8a50-49f8-37d4-08daf0099b3d/481cd73e-aee1-4a7b-9b84-bb90ba37d911/HSHD720',
  ];

  // "https://s40.upera.net/3007344-0-Spellbound-720.mp4?owner=6945754&bs=28&ref=1794068&id=30073441046055732"
  // https://dlmoovie.ir/content/download/c6627fc4-8a50-49f8-37d4-08daf0099b3d/481cd73e-aee1-4a7b-9b84-bb90ba37d911/HSHD720
  // https://upmediaa.upera.tv/3007344-0-720.mp4?ref=7wIA
  // https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-VideoSample-720p.mp4




  // console.log('isTV: ',isTV);

  return (
    <div className="App">
      <div className='screen-size'>
        <span>Device: {rdd.deviceType}|{rdd.browserName}{rdd.isSmartTV && '|is SmartTV'}{rdd.isDesktop && '|Desktop'}{rdd.isBrowser && '|isBrowser'}|
        </span>
        <span>Screen Size: {window.innerWidth}x{window.innerHeight}</span>

      </div>
      {/* This section is for getting my TV info for setting CORS */}
      {/* <pre style={{textWrap: 'wrap', color: 'whitesmoke', opacity: '0.3'}}>
        {JSON.stringify(rdd, null, 2)}
      </pre> */}
      <div className='app-container'>
        {/* <h1>MDe Player</h1> */}
        <button
          className='show-input-section'
          onClick={handleShowInputSectionClick}>
          {showInputSection ? 'Hide Input Movie' : 'Show Input Movie'}
        </button>
        {
          showInputSection &&
          <InputSection
            WORKER_URL={WORKER_URL}
            // videoUrl={videoUrl}
            // setVideoUrl={setVideoUrl}
            // subtitleFile={subtitleFile}
            // setSubtitleFile={setSubtitleFile}
            handleClearList={handleClearList}
            videoList={videoList}
            setVideoList={setVideoList}
            setShowInputSection={setShowInputSection}
          />
        }

        <button
          className='show-video-list'
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
        <div className='TV'>
          <input id='TV' type='checkbox' checked={isTV} onChange={(e) => setIsTV(e.target.checked)} />
          <label htmlFor='TV' style={{ color: isTV ? '#ffff00' : '#555', fontWeight: 'bold' }}>Watching in TV</label>
        </div>
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
