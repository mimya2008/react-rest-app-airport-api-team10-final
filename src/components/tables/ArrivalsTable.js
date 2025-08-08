import React from 'react';

function ArrivalsTable({ arrivals }) {
    return (
        <div>
            <h2>Arrivals</h2>
            <table>
                <thead>
                    <tr>
                        <th>Flight ID</th>
                        <th>Airline</th>
                        <th>Airfact</th>
                        <th>From</th>
                    </tr>
                </thead>
                <tbody>
                    {arrivals.map(flight => (
                        <tr key={flight.id}>
                            <td>{flight.id}</td>
                            <td>{flight.airline?.name}</td>
                            <td>{flight.aircraft?.name}</td>
                            <td>{flight.departureAirport?.name}</td>
                            <td>{flight.city?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ArrivalsTable;