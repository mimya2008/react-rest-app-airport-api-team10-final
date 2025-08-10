import React from 'react';

function DeparturesTable({ departures }) {
  return (
    <div>
      <h2>Departures</h2>
      <table>
        <thead>
          <tr>
            <th>Flight #</th>
            <th>Airline</th>
            <th>Aircraft Type</th>
            <th>To</th>
            <th>Gate</th>
            <th>Scheduled</th>
          </tr>
        </thead>
        <tbody>
          {departures.map(f => (
            <tr key={f.id}>
              <td>{f.flightNumber}</td>
              <td>{f.airline?.name}</td>
              <td>{f.aircraft?.type}</td>
              <td>{f.arrivalAirport?.name}</td>
              <td>{f.gate}</td>
              <td>{f.scheduledDateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeparturesTable;
