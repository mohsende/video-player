import React from 'react'
// import '';

function Search() {
  return (
    <div>
      <h3>Search Page</h3>
      <video
        id="vid1"
        className="video-js vjs-default-skin"
        controls
        autoPlay
        width="500" height="264"
        data-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "https://www.youtube.com/watch?v=xjS6SftYQaQ"}] }'
      >
      </video>
    </div>
  )
}

export default Search