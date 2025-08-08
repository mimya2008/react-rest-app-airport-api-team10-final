import React from 'react';

function DeparturesTable({ departures }) {
    return (
        <div>
            <h2>Departures</h2>
            <table>
                <thead>
                    <tr>
                        <th>Flight ID</th>
                        <th>Airline</th>
                        <th>Aircraft</th>
                        <th>To</th>
                    </tr>
                </thead>
                <tbody>
                    {departures.map(flight => (
                        <tr key={flight.id}>
                            <td>{flight.id}</td>
                            <td>{flight.airline?.name}</td>
                            <td>{flight.aircraft?.name}</td>
                            <td>{flight.arrivalAirport?.name}</td>
                            <td>{flight.city?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeparturesTable;