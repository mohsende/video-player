import React from 'react';
import './InputSection.css';

function InputSection({ videoUrl, setVideoUrl, setSubtitleFile, handleAddVideo, handleClearList }) {
  return (
    <div className='inputSection'>
      <div className='input'>
        <input
          type="text"
          className='videoUrl'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
        <input
          type="file"
          id='fileUpload'
          accept=".vtt"
          onChange={(e) => setSubtitleFile(e.target.files[0])}
        />
      </div>
      <button className='addBtn' onClick={handleAddVideo}>+</button>
      <button className='clearBtn' onClick={handleClearList}>-</button>
    </div>
  );
}

export default InputSection;
