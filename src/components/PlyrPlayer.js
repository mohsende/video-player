import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const PlyrPlayer = ({ videoSrc }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // ایجاد پلیر بعد از بارگذاری کامپوننت
    const player = new Plyr(playerRef.current, {
      // تنظیمات اختیاری
      autoplay: true,
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    });

    // پاکسازی پلیر زمانی که کامپوننت از DOM حذف می‌شود
    return () => {
      player.destroy();
    };
  }, []);

  return (
    <div>
      <video ref={playerRef} controls>
        <source src={videoSrc} type="video/WebM" />
        <track kind="subtitles" srcLang="en" src="subtitles_en.vtt" default />
      </video>
    </div>
  );
};

export default PlyrPlayer;
