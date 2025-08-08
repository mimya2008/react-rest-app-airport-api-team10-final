import React, { useState } from 'react';
import EntityTable from './EntityTable';

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
            className="btn btn-outline-primary"
            onClick={() => setSelectedEntity(entity.toLowerCase())}
          >
            {entity}
          </button>
        ))}
      </div>

      {selectedEntity && (
        <EntityTable entity={selectedEntity} />
      )}
    </div>
  );
}

export default AdminDashboard;
