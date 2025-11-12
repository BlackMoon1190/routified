import React from 'react';

const WaypointList = ({ waypoints, onAdd, onView, onEdit, onDelete, onDownload }) => {
    return (
        <>
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
                                onClick={() => alert(`Open map for waypoint ID: ${wp.id}`)}
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