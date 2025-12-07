import { useState, useEffect } from 'react';
import { canUseSystemApp } from '../utils';

const MapProviderSelector = () => {
    const [provider, setProvider] = useState('always-ask');

    useEffect(() => {
        const savedProvider = localStorage.getItem('mapProvider');
        if (savedProvider) {
            setProvider(savedProvider);
        }
    }, []);

    const handleChange = (event) => {
        const newProvider = event.target.value;
        setProvider(newProvider);
        localStorage.setItem('mapProvider', newProvider);
    };

    return (
        <div className="map-provider-selector">
            <label htmlFor="map-provider">Default Map Provider: </label>
            <select id="map-provider" value={provider} onChange={handleChange}>
                <option value="always-ask">Always Ask</option>
                <option value="google">Google Maps</option>
                <option value="osm">OpenStreetMap</option>
                {canUseSystemApp() && <option value="system">System App</option>}
            </select>
        </div>
    );
};

export default MapProviderSelector;
