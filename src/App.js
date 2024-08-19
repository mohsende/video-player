import React, { useState, useEffect } from 'react';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [links, setLinks] = useState([]);

  // Load links from Cloudflare Workers API
  useEffect(() => {
    fetch('https://your-worker-url.workers.dev')
      .then((response) => response.json())
      .then((data) => setLinks(data))
      .catch((error) => console.error('Error loading links:', error));
  }, []);

  const handleAddLink = () => {
    if (videoUrl && !links.includes(videoUrl)) {
      const newLinks = [...links, videoUrl];
      setLinks(newLinks);
      setVideoUrl('');
      // Save new link to Cloudflare Workers API
      fetch('https://your-worker-url.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoUrl),
      }).catch((error) => console.error('Error saving link:', error));
    }
  };

  const handleLoadLink = (link) => {
    setVideoUrl(link);
  };

  const handleDeleteLink = (linkToDelete) => {
    const newLinks = links.filter((link) => link !== linkToDelete);
    setLinks(newLinks);
    // Optionally update the list in the backend
  };

  return (
    <div>
      <h1>Video Player</h1>
      <input
        type="text"
        placeholder="Enter video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button onClick={handleAddLink}>Add</button>
      {videoUrl && (
        <video width="600" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <span onClick={() => handleLoadLink(link)}>{link}</span>
            <button onClick={() => handleDeleteLink(link)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
