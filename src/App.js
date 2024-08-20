import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [links, setLinks] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  // تابع برای گرفتن لینک‌ها از Workers KV
  const fetchLinks = async () => {
    const response = await fetch('https://videolinks.bugatichapi.workers.dev/');
    const data = await response.json();
    setLinks(data);
  };

  // تابع برای اضافه کردن لینک جدید
  const addLink = async () => {
    if (videoUrl) {
      const response = await fetch('https://videolinks.bugatichapi.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoUrl)
      });

      if (response.ok) {
        setLinks([...links, videoUrl]);
        setVideoUrl('');
      }
    }
  };

  // تابع برای حذف لینک
  const deleteLink = async (link) => {
    const response = await fetch('https://videolinks.bugatichapi.workers.dev/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(link)
    });

    if (response.ok) {
      setLinks(links.filter(item => item !== link));
    }
  };

  return (
    <div>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter video URL"
      />
      <button onClick={addLink}>Add Video</button>

      <ul>
        {links.map((link, index) => (
          <li key={index}>
            {link}
            <button onClick={() => deleteLink(link)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
