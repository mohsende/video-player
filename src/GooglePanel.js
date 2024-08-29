import React, { useRef } from 'react';
import './GooglePanel.css';


function GooglePanel({ showGoogle, googleUrl, handleGoogleClick, handleBackButtonClick }) {
  const iframeRef = useRef(null);

  return (
    <div className={`rightPanel ${showGoogle ? 'show' : ''}`} style={{ width: showGoogle ? '50%' : 'auto' }}>
      {showGoogle ? (
        <>
          <button className='backBtn' onClick={handleBackButtonClick}>Back</button>
          <iframe
            src={googleUrl}
            title="Google Search"
            width="100%"
            height="100%"
            ref={iframeRef}
            frameBorder="0"
          />
        </>
      ) : (
        <button className='googleBtn' onClick={handleGoogleClick}>Google</button>
      )}
    </div>
  );
}

export default GooglePanel;
