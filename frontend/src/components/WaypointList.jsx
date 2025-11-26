import React, { useState } from 'react';
import MapChoiceModal from './MapChoiceModal';
import { 
    getSystemMapUrl, 
    getGoogleMapsUrl, 
    getOsmUrl, 
    canUseSystemApp,
    openNativeLink // New import
} from '../utils.js';

const WaypointList = ({ waypoints, onAdd, onView, onEdit, onDelete, onDownload }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWaypoint, setSelectedWaypoint] = useState(null);

    const handleMapChoice = (choice) => {
        if (!selectedWaypoint) return;
    
        let url;
        switch (choice) {
            case 'system':
                url = getSystemMapUrl(selectedWaypoint);
                break;
            case 'google':
                url = getGoogleMapsUrl(selectedWaypoint);
                break;
            case 'osm':
                url = getOsmUrl(selectedWaypoint);
                break;
            default:
                break;
        }

        // First, close the modal and clear state. This deactivates the focus trap.
        setIsModalOpen(false);
        setSelectedWaypoint(null);
    
        if (url) {
            // Use a timeout to ensure the focus trap is deactivated before opening the link.
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
        showMapChoiceModal(waypoint);
    };

    return (
        <>
            <MapChoiceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onChoose={handleMapChoice}
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