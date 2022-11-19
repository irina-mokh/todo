import React from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  close: () => void,
  title: string,
  children: React.ReactNode,
};

export const Modal = ({ close, children, title }: ModalProps) => {
  const closeModal = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    close();
  };

  const modalContent = (
    <div className="overlay" onClick={closeModal}>
      <div className='popup' onClick={(e) => e.stopPropagation()}>
        <header className="popup__header">
          {title && <h2>{title}</h2>}
          <button className="close-btn" onClick={closeModal}>
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
