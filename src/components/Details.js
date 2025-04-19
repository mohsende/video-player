import React, { useEffect, useState } from 'react';
import '../styles/details.scss'

function Details({ videoToEdit }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPoster, setVideoPoster] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoType, setVideoType] = useState('');
  const [videoSeason, setVideoSeason] = useState('');
  const [videoEpisode, setVideoEpisode] = useState('');


  useEffect(() => {
    if (videoToEdit) {
      setVideoUrl(videoToEdit.url);
      setVideoPoster(videoToEdit.poster);
      setVideoTitle(videoToEdit.title);
      setVideoType(videoToEdit.type);
      setVideoSeason(videoToEdit.season);
      setVideoEpisode(videoToEdit.episode);
    }
  }, [])


  function handleSaveClick() {

  }

  return (
    <div className='details-container flex-row'>
      <div className='card'
        style={{ backgroundImage: `url('${videoPoster}')`, backgroundSize: 'cover' }} >
      </div>
      <div className='details-box flex-col'>
        <div className='url flex-col'>
          <span>Video URL</span>
          <input
            type="text"
            className='video-url'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL"
          />

        </div>
        <div className='url flex-col'>
          <span>Video poster URL</span>
          <input
            type="text"
            className='poster-url'
            value={videoPoster}
            onChange={(e) => setVideoPoster(e.target.value)}
            placeholder="Movie poster URL"
          />

        </div>
        <div className='flex-row'>
          <div className='flex-col name-type'>
            <span>Video name</span>
            <input
              type="text"
              className='movie-name'
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Movie name"
            />
          </div>
          <div className='flex-col name-type'>
            <span>Video type</span>
            <input
              type="text"
              className='type'
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              placeholder="Movie type"
            />
          </div>
        </div>
        <div className='flex-row season-episode'>
          <div className='flex-col season-episode'>
            <span>Season</span>
            <input
              type="text"
              className='season'
              value={videoSeason}
              onChange={(e) => setVideoSeason(e.target.value)}
              placeholder="Season"
            />
          </div>
          <div className='flex-col season-episode'>
            <span>Episode</span>
            <input
              type="text"
              className='episode'
              value={videoEpisode}
              onChange={(e) => setVideoEpisode(e.target.value)}
              placeholder="Episode"
            />
          </div>
        </div>
        <button className='save-btn' onClick={handleSaveClick}>Save</button>
      </div>
    </div>
  )
}

export default Details