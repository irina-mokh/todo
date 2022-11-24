import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  title: string,
  children: React.ReactNode,
  close: () => void,
};

export const Modal = ({ close, children, title }: ModalProps) => {
  useEffect(() => {
    const closeEsc = (e: KeyboardEvent) => {
      if(e.code === 'Escape'){
        close()
      }
    }
    document.addEventListener('keydown', closeEsc)
  return () => document.removeEventListener('keydown', close)
  }, []);

  const modalContent = (
    <div className="overlay" onClick={close}>
      <div className='popup' onClick={(e) => e.stopPropagation()}>
        <header className="popup__header">
          {title && <h2>{title}</h2>}
          <button className="close-btn" onClick={close} aria-label="close">
            🗙
          </button>
        </header>
        <div className="popup__body">{children}</div>
      </div>
    </div>
  );
  const root = document.getElementById('modal-root');
  
  return root ? ReactDOM.createPortal(modalContent, root) : null;
};
