import React, { useEffect } from 'react';
import FocusTrap from 'focus-trap-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.keyCode === 27) {
            onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Effect to handle mobile back button
    useEffect(() => {
        const handlePopstate = () => {
            onClose();
        };

        if (isOpen) {
            // When the modal opens, push a state to history
            history.pushState({ isModalOpen: true }, '');
            window.addEventListener('popstate', handlePopstate);
        } else if (history.state && history.state.isModalOpen) {
            // This handles when the modal is closed by means other than the back button.
            // If our state is still in history, go back to remove it.
            history.back();
        }

        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <FocusTrap
            active={isOpen}
            focusTrapOptions={{
            }}
        >
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button className="modal-close" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
};

export default Modal;
