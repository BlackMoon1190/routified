import React from 'react';

const RouteList = ({ routes, onAdd, onView, onEdit, onDelete, onDownload }) => {
    return (
        <>
            <h2>List of all routes ({routes.length}):</h2>

            <button 
                className="main-action-btn add-btn-style" 
                onClick={onAdd}
            >
                + Add new route
            </button>
            
            <button 
                className="main-action-btn download-btn-style" 
                onClick={onDownload}
            >
                Export all routes (CSV)
            </button>
            
            <ul className="item-list">
                {routes.map(route => (
                    <li key={route.id}>
                        <span>{route.name}</span>
                        <div>
                            <button 
                                className="view-btn-style" 
                                onClick={() => onView(route.id)}
                            >
                                View
                            </button>
                            <button 
                                className="edit-btn-style" 
                                onClick={() => onEdit(route.id)}
                            >
                                Edit
                            </button>
                            <button 
                                className="delete-btn-style" 
                                onClick={() => onDelete(route.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <hr style={{ margin: '30px 0' }}/>
        </>
    );
};

export default RouteList;