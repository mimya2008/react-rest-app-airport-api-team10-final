import React, { useState, useEffect } from 'react';
import ArrivalsTable from './tables/ArrivalsTable';
import DeparturesTable from './tables/DeparturesTable';
import './styles.css';

function FlightBoard({ selectedAirportName, view }) {
  const [arrivals, setArrivals] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    if (!selectedAirportName) return;

    setLoading(true);
    setError('');
    setArrivals([]);
    setDepartures([]);

    const fetchArrivals = () =>
      fetch(`${API_URL}/flights/arrivals?airportName=${encodeURIComponent(selectedAirportName)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch arrivals');
          return res.json();
        });

    const fetchDepartures = () =>
      fetch(`${API_URL}/flights/departures?airportName=${encodeURIComponent(selectedAirportName)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch departures');
          return res.json();
        });

    if (view === 'arrivals') {
      fetchArrivals()
        .then(setArrivals)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (view === 'departures') {
      fetchDepartures()
        .then(setDepartures)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (view === 'both') {
      Promise.all([fetchArrivals(), fetchDepartures()])
        .then(([a, d]) => {
          setArrivals(a);
          setDepartures(d);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [selectedAirportName, view]);

  if (!selectedAirportName) return <p>Please select an airport to find flight information.</p>;
  if (loading) return <p>Loading flights...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Flight Board for {selectedAirportName}</h2>
      {(view === 'arrivals' || view === 'both') && <ArrivalsTable arrivals={arrivals} />}
      {(view === 'departures' || view === 'both') && <DeparturesTable departures={departures} />}
    </div>
  );
}

export default FlightBoard;
