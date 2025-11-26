export const getQuery = (waypoint) => {
    if (!waypoint) return '';
    if (waypoint.latitude && waypoint.longitude) {
        return `${waypoint.latitude},${waypoint.longitude}`;
    } else if (waypoint.city) {
        const addressParts = [
            waypoint.street,
            waypoint.house_number,
            waypoint.apartment_number,
            waypoint.postal_code,
            waypoint.city,
        ].filter(Boolean);
        return addressParts.join(' ');
    }
    return '';
};

export const getSystemMapUrl = (waypoint) => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const query = getQuery(waypoint);
    let url;

    if (isIOS) {
        url = waypoint.latitude && waypoint.longitude
            ? `maps://?ll=${query}`
            : `maps://?q=${encodeURIComponent(query)}`;
    } else { // Android
        if (waypoint.latitude && waypoint.longitude) {
            const label = encodeURIComponent(waypoint.name || 'Waypoint');
            url = `geo:0,0?q=${query}(${label})`;
        } else {
            url = `geo:0,0?q=${encodeURIComponent(query)}`;
        }
    }
    return url;
};

export const getGoogleMapsUrl = (waypoint) => {
    const query = getQuery(waypoint); // getQuery handles coords vs address
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const getOsmUrl = (waypoint) => {
    const hasCoords = waypoint.latitude && waypoint.longitude;
    if (hasCoords) {
        const { latitude: lat, longitude: lng } = waypoint;
        return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    } else {
        const query = getQuery(waypoint);
        const osmQuery = query.replace(/ /g, ', ');
        return `https://www.openstreetmap.org/search?query=${encodeURIComponent(osmQuery)}`;
    }
};

export const canUseSystemApp = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|android/.test(ua);
};

export const openNativeLink = (url) => {
    // Workaround for browser security: directly calling window.open() for non-http(s) is sometimes blocked.
    // We create and programmatically click an invisible link that simulates a user-initiated nav event
    const link = document.createElement('a');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
