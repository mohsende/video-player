import React, { useState } from 'react';

const LinkGenerator = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [links, setLinks] = useState([]);

  const handleAddLink = () => {
    const newUrl = `https://anym3u8player.com/mp4-player/?url=${inputUrl}`;
    setLinks([...links, newUrl]);
    setInputUrl('');
  };

  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      <input
        type="text"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={handleAddLink}>Add Link</button>
      <ul>
        {links.map((link, index) => (
          <li key={index} onClick={() => handleLinkClick(link)}>
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkGenerator;
