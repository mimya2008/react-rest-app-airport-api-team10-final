import React from 'react';

function ArrivalsTable({ arrivals }) {
  return (
    <div>
      <h2>Arrivals</h2>
      <table>
        <thead>
          <tr>
            <th>Flight #</th>
            <th>Airline</th>
            <th>Aircraft Type</th>
            <th>From</th>
            <th>Gate</th>
            <th>Scheduled</th>
          </tr>
        </thead>
        <tbody>
          {arrivals.map(f => (
            <tr key={f.id}>
              <td>{f.flightNumber}</td>
              <td>{f.airline?.name}</td>
              <td>{f.aircraft?.type}</td>
              <td>{f.departureAirport?.name}</td>
              <td>{f.gate}</td>
              <td>{f.scheduledDateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArrivalsTable;
