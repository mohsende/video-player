import React, { useState } from 'react';
import '../styles/VideoList.scss';
import Skaleton from './Skaleton';
import { useEffect } from 'react';


function VideoList({ WORKER_URL, setCaptions, setCurrentVideo, isTV }) {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    fetchVideoList();
  }, []);

  const fetchVideoList = async () => {
    setLoading(true);
    try {
      const response = await fetch(WORKER_URL);
      const data = await response.json();
      setVideoList(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
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

  
  return (<>
    <ul className='movie-list'>
      {loading && <><li className=''><Skaleton /></li><li><Skaleton /></li></>}
      {videoList.map((video, index) => {
        const jsonVideo = JSON.stringify(video);
        var hasSub = jsonVideo.includes(`subtitle`); //Check for having subtitle
        // console.log(jsonVideo.includes(`subtitle`));
        return(
        <li key={index} className='movie-card'>
          <div className='movie-card-content'
            style={{
              backgroundImage: `url(${video.poster})`,
              }} 
              onClick={() => handleVideoClick(video.url)}>
            <span className='video-name'>
              <p>{video.title}</p>
              <p>{video.type === 'series' && `S:${video.season}   E:${video.episode}`}</p>
              {hasSub && 
              <span className={hasSub ? 'is-sub' : undefined}>Subtitle</span>}
            </span>
            
            <button className='delete-btn' onClick={(event) => handleDeleteVideo(event, video.url)}>DELETE</button>
          </div>
        </li>
      )})}
    </ul>
  </>
  );
}

export default VideoList;
