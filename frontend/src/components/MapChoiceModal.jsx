import Modal from './Modal';

const MapChoiceModal = ({ isOpen, onClose, onChoose, showSystemAppOption }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Choose a map provider">
            <p>Select how you'd like to open the map.</p>
            <div className="modal-actions">
                {showSystemAppOption && (
                    <button id="btn-system-app" onClick={() => onChoose('system')}>Use System App</button>
                )}
                <button id="btn-google-maps" onClick={() => onChoose('google')}>Google Maps</button>
                <button id="btn-osm" onClick={() => onChoose('osm')}>OpenStreetMap</button>
            </div>
        </Modal>
    );
};

export default MapChoiceModal;
