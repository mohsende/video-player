import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/Modal.scss'

function Modal({ isOpen, onClose, children }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        {children}
        <button className="close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal