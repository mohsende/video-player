import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/Modal.scss'

function Modal({ isOpen, onClose, isPopUp, children }) {
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
    <div className={`modal-overlay ${isOpen ? 'open' : ''} ${isPopUp ? 'popup' : ''}`} onClick={onClose}>
      <div className={`modal`} onClick={e => e.stopPropagation()}>
        {children}
        <button className="close" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default Modal