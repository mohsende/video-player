import React, { useRef, useState, useEffect } from 'react';
import '../styles/VideoList.scss';
import Skaleton from './Skaleton';
import Modal from './Modal.js';
import Details from './Details';


function VideoList({ WORKER_URL, videoList, setVideoList, setCaptions, setCurrentVideo, isProxy }) {
  // const [videoList, setVideoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [videoToEdit, setVideoToEdit] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTvCheck, setIsTvCheck] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const checkRef = useRef(null);
  const episodRef = useRef(null);
  const videoLiRef = useRef(null);

  useEffect(() => {
    setCaptions([]);
    setCurrentVideo('');
    fetchVideoList();
  }, []);

  useEffect(() => {
    if (videoToEdit !== '') {
      setIsEditModalOpen(true);
    }
  }, [videoToEdit]);

  // const fetchVideoList = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(WORKER_URL);
  //     const data = await response.json();
  //     const sorted = (data || []).sort((a, b) =>
  //       (a.title || '').localeCompare(b.title || '')
  //     );
  //     setVideoList(sorted);
  //     // setVideoList(data || []);
  //     // console.log(videoList);
  //   } catch (error) {
  //     console.error('Error fetching links:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // new fetch method
  const fetchVideoList = async () => {
    setLoading(true);
    try {
      const response = await fetch(WORKER_URL);
      const data = await response.json();

      // اگر چیزی نیامده بود
      if (!data) {
        setVideoList([]);
        return;
      }

      // مرتب‌سازی سطح بالا
      const sorted = data.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );

      // مرتب‌سازی اپیزودها (اگر موجود بود)
      sorted.forEach(item => {
        if (item.episodes && Array.isArray(item.episodes)) {
          item.episodes.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '')
          );
        }
      });

      setVideoList(sorted);

      setFilteredList(sorted.filter((video, index, self) => {
        if (video.type !== 'series') return true; // فقط برای سریال‌ها چک کن

        // ببین آیا ویدیوی مشابه (با type=series و title یکسان) قبل‌تر بوده یا نه
        return (
          index ===
          self.findIndex(
            (v) => v.type === 'series' && v.title === video.title
          )
        );
      }));
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
  
  const handleDeleteVideo = async (event, video) => {
    event.stopPropagation();
    if (window.confirm(`Are you sure to delete?\n${video.title} ${video.type === 'series' ? 'S'+video.season+'E'+video.episode : ''}`)) {
      setCurrentVideo('');
      const url = video.url
      try {
        await fetch(WORKER_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const updatedList = videoList.filter(v => v.url !== url);
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


  const handleChangeEpisode = (currentVideo, direction) => {
    // پیدا کردن همه‌ی اپیزودهای همین سریال
    const seriesEpisodes = videoList.filter(v => v.title === currentVideo.title);

    const currentIndex = seriesEpisodes.findIndex(v => v.url === currentVideo.url);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // اگر ایندکس جدید معتبر نبود، برنگرد
    if (nextIndex < 0 || nextIndex >= seriesEpisodes.length) return;

    const newEpisode = seriesEpisodes[nextIndex];

    // حالا کارت فعلی رو در filteredList با قسمت جدید جایگزین می‌کنیم
    setFilteredList(prev =>
      prev.map(v =>
        v.url === currentVideo.url ? { ...newEpisode } : v
      )
    );
  };


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
      {
        
      }
      {filteredList.map((video, index) => {
        const jsonVideo = JSON.stringify(video);
        var hasSub = jsonVideo.includes(`subtitle`); //Check for having subtitle
        // console.log(jsonVideo.includes(`subtitle`));
        // console.log(video.title);
        return (
          <li
            // ref={videoLiRef}
            key={index}
            className={`movie-card ${video.type === 'series' ? 'series-card' : ''}`}
            style={{ '--poster-url': `url(${video.poster})` }}
          >
            {video.type === 'series' && (
              <div className="card-back"></div>
            )}
            <div className='movie-card-content'
              style={{
                backgroundImage: `url(${video.poster})`,
                // '--poster-url': `url(${video.poster})`
              }}
            >
              <span className='video-name'>
                <p>{video.title}</p>
                {video.type === 'series' && (
                  <p ref={episodRef}>S:{video.season} E:{video.episode}</p>
                )}
                {hasSub &&
                  <span className={hasSub ? 'is-sub' : undefined}>Subtitle</span>}
              </span>
              <i className={`${video.type === 'series' ? 'previous-season fa fa-angle-left' : 'hidden'}`} aria-hidden="true"
                onClick={() => handleChangeEpisode(video, 'prev')}></i>
              <i className='play fa fa-play' aria-hidden="true"
                onClick={() => handleVideoClick(video.url)}></i>
              <i className={`${video.type === 'series' ? 'next-season fa fa-angle-right' : 'hidden'}`} aria-hidden="true"
                onClick={() => handleChangeEpisode(video, 'next')}></i>
              <button className='edit-btn' onClick={(event) => handleEditVideo(event, video.url)}>EDIT</button>
              <button className='delete-btn' onClick={(event) => handleDeleteVideo(event, video)}>DELETE</button>
            </div>
          </li>
        )
      })}
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
