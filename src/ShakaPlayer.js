import React, { useRef, useEffect } from 'react';
import shaka from 'shaka-player';

function ShakaPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = new shaka.Player(videoRef.current);

    player.load(src).catch(error => {
      console.error('Error loading video:', error);
    });

    return () => {
      player.destroy();
    };
  }, [src]);

  return <video ref={videoRef} controls style={{ width: '100%' }} />;
}

export default ShakaPlayer;
