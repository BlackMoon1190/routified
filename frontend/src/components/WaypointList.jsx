import { useState } from 'react';
import MapChoiceModal from './MapChoiceModal';
import { 
    getSystemMapUrl, 
    getGoogleMapsUrl, 
    getOsmUrl, 
    canUseSystemApp,
    openNativeLink
} from '../utils.js';

const WaypointList = ({ waypoints, onAdd, onView, onEdit, onDelete, onDownload }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWaypoint, setSelectedWaypoint] = useState(null);

    const handleMapChoice = (choice, waypoint) => {
        if (!waypoint) return;
    
        let url;
        switch (choice) {
            case 'system':
                url = getSystemMapUrl(waypoint);
                break;
            case 'google':
                url = getGoogleMapsUrl(waypoint);
                break;
            case 'osm':
                url = getOsmUrl(waypoint);
                break;
            default:
                break;
        }

        setIsModalOpen(false);
        setSelectedWaypoint(null);
    
        if (url) {
            setTimeout(() => {
                if (choice === 'system') {
                    openNativeLink(url);
                } else {
                    window.open(url, '_blank');
                }
            }, 0);
        }
    };

    const showMapChoiceModal = (waypoint) => {
        setSelectedWaypoint(waypoint);
        setIsModalOpen(true);
    };

    const openMap = (waypoint) => {
        const savedProvider = localStorage.getItem('mapProvider');
        if (savedProvider && savedProvider !== 'always-ask') {
            handleMapChoice(savedProvider, waypoint);
        } else {
            showMapChoiceModal(waypoint);
        }
    };

    return (
        <>
            <MapChoiceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onChoose={(choice) => handleMapChoice(choice, selectedWaypoint)}
                showSystemAppOption={canUseSystemApp()}
            />

            <h2>List of all waypoints ({waypoints.length}):</h2>
            
            <button 
                className="main-action-btn add-btn-style" 
                onClick={onAdd}
            >
                + Add new waypoint
            </button>
            
            <button 
                className="main-action-btn download-btn-style" 
                onClick={onDownload}
            >
                Export all waypoints (CSV)
            </button>
            
            <ul className="item-list">
                {waypoints.map(wp => (
                    <li key={wp.id}>
                        <span>
                            {wp.name || '(No Name)'}
                            {wp.city && ` (${wp.street} ${wp.house_number}, ${wp.city})`}
                            {!wp.city && wp.latitude && ` (${wp.latitude}, ${wp.longitude})`}
                        </span>

                        <div>
                            <button 
                                className="map-btn-style" 
                                onClick={() => openMap(wp)}
                            >
                                Open map
                            </button>
                            <button 
                                className="view-btn-style" 
                                onClick={() => onView(wp.id)}
                            >
                                View
                            </button>
                            <button 
                                className="edit-btn-style" 
                                onClick={() => onEdit(wp.id)}
                            >
                                Edit
                            </button>
                            <button 
                                className="delete-btn-style" 
                                onClick={() => onDelete(wp.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default WaypointList;