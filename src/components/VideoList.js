import React, { useRef, useState, useEffect } from 'react';
import '../styles/VideoList.scss';
import Skaleton from './Skaleton';
import Modal from './Modal.js';
import Details from './Details';


function VideoList({ WORKER_URL, setCaptions, setCurrentVideo, isProxy }) {
  const [videoList, setVideoList] = useState([]);
  const [videoToEdit, setVideoToEdit] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTvCheck, setIsTvCheck] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const checkRef = useRef(null);

  useEffect(()=> {
    setCaptions([]);
    setCurrentVideo('');
    fetchVideoList();
  }, []);
  
  useEffect(()=> {
    if (videoToEdit !== '') {
      setIsEditModalOpen(true);
    }
  }, [videoToEdit]);
  
  const fetchVideoList = async () => {
    setLoading(true);
    try {
      const response = await fetch(WORKER_URL);
      const data = await response.json();
      setVideoList(data || []);
      // console.log(videoList);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  async function subtitleToBlob(url) {
    try {
      const response = await fetch(url);
      const subtitleContent = await response.text();
      // const trackElement = document.getElementById('subtitleTrack');
      const blob = new Blob([subtitleContent], { type: 'text/vtt' });
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } catch (error) {
      console.error('Error fetching subtitle:', error);
    }
  }

  const handleVideoClick = async (url) => {
    const video = videoList.find(video => video.url === url);

    // Generate proxy URL
    const proxyUrl = `${WORKER_URL}proxyVideo/${encodeURIComponent(url)}`;

    // Find subtitles
    const subtitles = Object.keys(video)
      .filter(key => key.startsWith("subtitle"))
      .map(key => video[key]);
    // console.log('subtitles', subtitles);

    // Create subtitle tracks
    const newSubsPromises = subtitles.map(async (subtitle, index) => ({
      label: `Fa ${subtitle.split('/').pop().split('-subtitle').pop().split('.')[0]}`,
      kind: 'subtitles',
      src: await subtitleToBlob(subtitle),
      default: index === 0, // Set the first subtitle as default
    }));
    const newSubs = await Promise.all(newSubsPromises);
    // console.log('newSubs', newSubs);

    // Bypass CORS if using TV otherwise use Cloudflare proxy if using browser
    // if (isTV) {
    //   setCurrentVideo(video.url);
    // } else {
    //   setCurrentVideo(proxyUrl);
    // }
    
    // Using Cloudflare proxy for bypassing filtering like telegram videos
    if (!isProxy) {
      setCurrentVideo(video.url);
    } else {
      setCurrentVideo(proxyUrl);
    }

    // setCurrentVideo(video.url);
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

  function handleEditModalClose() {
    setVideoToEdit('');
    setIsEditModalOpen(false);
  }

  const handleEditVideo = async (event, url) => {
    event.stopPropagation();
    setVideoToEdit(videoList.filter(video => video.url === url)[0]);
  };

  // function handleToggleCheck() {
  //   if(isTV)
  //     setIsTV(false);
  //   else
  //     setIsTV(true);

  // }

  
  return (<>
    {/* <div className='inTv-container'>
      <div ref={checkRef} className={`inTv ${isTV ? 'checked' : 'unchecked'}`} onClick={handleToggleCheck}>
        <div className={isTV ? `checked` : 'unchecked'}></div>
      </div>
    </div> */}
    <ul className='movie-list'>
      {loading && <>
        <Skaleton />
        <Skaleton />
        </>}
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
            
            <button className='edit-btn' onClick={(event) => handleEditVideo(event, video.url)}>EDIT</button>
            <button className='delete-btn' onClick={(event) => handleDeleteVideo(event, video.url)}>DELETE</button>
          </div>
        </li>
      )})}
    </ul>
    <Modal
      isOpen={isEditModalOpen}
      onClose={handleEditModalClose}
      isPopUp={false}
    >
      <Details
        videoToEdit={videoToEdit}
      />
    </Modal>
  </>
  );
}

export default VideoList;
