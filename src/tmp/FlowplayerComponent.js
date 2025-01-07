import React, { useEffect, useRef } from 'react';

const FlowplayerComponent = ({ videoUrl }) => {
  const videoContainerRef = useRef(null);

  useEffect(() => {
    if (videoUrl) {
      window.flowplayer(videoContainerRef.current, {
        clip: {
          sources: [
            { type: "video/mp4", src: videoUrl }
          ]
        }
      });
    }
  }, [videoUrl]);

  return (
    <div ref={videoContainerRef} className="flowplayer" style={{ width: '100%', height: 'auto' }}>
      <video controls></video>
    </div>
  );
};

export default FlowplayerComponent;
