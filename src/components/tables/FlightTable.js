import React, { useEffect, useState } from 'react';

function FlightTable() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalData, setModalData] = useState({
    id: null,
    flightNumber: '',
    gate: '',
    fromLocation: '',
    destination: '',
    scheduledDateTime: '',
    departureAirportName: '',
    arrivalAirportName: '',
    airlineName: '',
    aircraftType: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/flights');
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load flights.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    try {
      await fetch(`http://localhost:8080/flights/${id}`, { method: 'DELETE' });
      fetchFlights();
    } catch (err) {
      console.error(err);
      alert('Failed to delete flight.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `http://localhost:8080/flights/${modalData.id}`
      : 'http://localhost:8080/flights';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightNumber: modalData.flightNumber,
          gate: modalData.gate,
          fromLocation: modalData.fromLocation,
          destination: modalData.destination,
          scheduledDateTime: modalData.scheduledDateTime,
          departureAirport: { name: modalData.departureAirportName },
          arrivalAirport: { name: modalData.arrivalAirportName },
          airline: { name: modalData.airlineName },
          aircraft: { type: modalData.aircraftType }
        }),
      });

      setModalData({
        id: null,
        flightNumber: '',
        gate: '',
        fromLocation: '',
        destination: '',
        scheduledDateTime: '',
        departureAirportName: '',
        arrivalAirportName: '',
        airlineName: '',
        aircraftType: ''
      });

      setIsEditMode(false);
      document.getElementById('flightModalCloseBtn').click();
      fetchFlights();
    } catch (err) {
      console.error(err);
      alert('Failed to save flight.');
    }
  };

  const openEditModal = (flight) => {
    setIsEditMode(true);
    setModalData({
      id: flight.id,
      flightNumber: flight.flightNumber,
      gate: flight.gate,
      fromLocation: flight.fromLocation,
      destination: flight.destination,
      scheduledDateTime: flight.scheduledDateTime,
      departureAirportName: flight.departureAirport?.name || '',
      arrivalAirportName: flight.arrivalAirport?.name || '',
      airlineName: flight.airline?.name || '',
      aircraftType: flight.aircraft?.type || ''
    });

    const modal = new window.bootstrap.Modal(document.getElementById('flightModal'));
    modal.show();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setModalData({
      id: null,
      flightNumber: '',
      gate: '',
      fromLocation: '',
      destination: '',
      scheduledDateTime: '',
      departureAirportName: '',
      arrivalAirportName: '',
      airlineName: '',
      aircraftType: ''
    });

    const modal = new window.bootstrap.Modal(document.getElementById('flightModal'));
    modal.show();
  };

  return (
    <div>
      <h3 className="text-center mb-3">Flight List</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && flights.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Flight #</th>
                <th>Gate</th>
                <th>From</th>
                <th>To</th>
                <th>Date/Time</th>
                <th>Airline</th>
                <th>Aircraft</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.id}</td>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.gate}</td>
                  <td>{flight.fromLocation}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.scheduledDateTime?.replace('T', ' ')}</td>
                  <td>{flight.airline?.name}</td>
                  <td>{flight.aircraft?.type}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(flight)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(flight.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={openAddModal}>
              + Add Flight
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center">No flights found.</p>
      )}

      {/* Modal */}
      <div className="modal fade" id="flightModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Flight' : 'Add Flight'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="flightModalCloseBtn"></button>
            </div>
            <div className="modal-body">
              {[
                ['Flight Number', 'flightNumber'],
                ['Gate', 'gate'],
                ['From Location', 'fromLocation'],
                ['Destination', 'destination'],
                ['Scheduled DateTime', 'scheduledDateTime', 'datetime-local'],
                ['Departure Airport Name', 'departureAirportName'],
                ['Arrival Airport Name', 'arrivalAirportName'],
                ['Airline Name', 'airlineName'],
                ['Aircraft Type', 'aircraftType']
              ].map(([label, key, type = 'text']) => (
                <div className="mb-3" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    value={modalData[key]}
                    onChange={(e) => setModalData({ ...modalData, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">{isEditMode ? 'Update' : 'Add'}</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FlightTable;
