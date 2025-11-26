import { useState, useEffect } from 'react';
import WaypointList from './components/WaypointList';
import RouteList from './components/RouteList';

const API_URL = `http://${window.location.hostname}:8000/api`;

function App() {
  const [waypoints, setWaypoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [waypointsResponse, routesResponse] = await Promise.all([
          fetch(`${API_URL}/waypoints/`),
          fetch(`${API_URL}/routes/`)
        ]);

        if (!waypointsResponse.ok || !routesResponse.ok) {
          throw new Error('API request failed');
        }

        const waypointsData = await waypointsResponse.json();
        const routesData = await routesResponse.json();

        setWaypoints(waypointsData);
        setRoutes(routesData);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  const handleWaypointAction = (action, id) => {
    alert(`Waypoint: ${action}, ID: ${id || 'New ID'}`);
  };

  const handleRouteAction = (action, id) => {
    alert(`Route: ${action}, ID: ${id || 'New ID'}`);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error occured: {error}</div>;
  }

  return (
    <>
      <h1><center>Routified</center></h1>

      <RouteList 
        routes={routes}
        onAdd={() => handleRouteAction('Add', null)}
        onView={(id) => handleRouteAction('View', id)}
        onEdit={(id) => handleRouteAction('Edit', id)}
        onDelete={(id) => handleRouteAction('Delete', id)}
        onDownload={() => handleRouteAction('Export all routes (CSV)', 'all')}
      />

      <WaypointList 
        waypoints={waypoints}
        onAdd={() => handleWaypointAction('Add', null)}
        onView={(id) => handleWaypointAction('View', id)}
        onEdit={(id) => handleWaypointAction('Edit', id)}
        onDelete={(id) => handleWaypointAction('Delete', id)}
        onDownload={() => handleWaypointAction('Export all waypoints (CSV)', 'all')}
      />
    </>
  );
}

export default App;