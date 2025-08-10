import React, { useState } from 'react';
import CityTable from './components/tables/CityTable';
import AirportTable from './components/tables/AirportTable';
import AirlineTable from './components/tables/AirlineTable';
import AircraftTable from './components/tables/AircraftTable';
import PassengerTable from './components/tables/PassengerTable';
import FlightTable from './components/tables/FlightTable';

const entities = ['City', 'Airport', 'Airline', 'Aircraft', 'Passenger', 'Flight'];

function AdminDashboard() {
  const [selectedEntity, setSelectedEntity] = useState('');

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Admin Dashboard</h1>

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
        {entities.map((entity) => (
          <button
            key={entity}
            className="btn-admin"
            onClick={() => setSelectedEntity(entity.toLowerCase())}
          >
            {entity}
          </button>
        ))}
      </div>

      {selectedEntity === 'city' && <CityTable />}
      {selectedEntity === 'airport' && <AirportTable />}
      {selectedEntity === 'airline' && <AirlineTable />}
      {selectedEntity === 'aircraft' && <AircraftTable />}
      {selectedEntity === 'passenger' && <PassengerTable />}
      {selectedEntity === 'flight' && <FlightTable />}
    </div>
  );
}

export default AdminDashboard;
