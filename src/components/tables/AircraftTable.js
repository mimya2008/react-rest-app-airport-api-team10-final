import React, { useEffect, useState } from 'react';

function AircraftTable() {
  const [aircraftList, setAircraftList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalData, setModalData] = useState({
    id: null,
    type: '',
    airlineName: '',
    numberOfPassengers: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAircraft();
  }, []);

  const fetchAircraft = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/aircraft');
      const data = await res.json();
      setAircraftList(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load aircraft.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this aircraft?')) return;
    try {
      await fetch(`http://localhost:8080/aircraft/${id}`, { method: 'DELETE' });
      fetchAircraft();
    } catch (err) {
      console.error(err);
      alert('Failed to delete aircraft.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `http://localhost:8080/aircraft/${modalData.id}`
      : 'http://localhost:8080/aircraft';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: modalData.type,
          airlineName: modalData.airlineName,
          numberOfPassengers: parseInt(modalData.numberOfPassengers)
        }),
      });

      setModalData({ id: null, type: '', airlineName: '', numberOfPassengers: '' });
      setIsEditMode(false);
      document.getElementById('aircraftModalCloseBtn').click();
      fetchAircraft();
    } catch (err) {
      console.error(err);
      alert('Failed to save aircraft.');
    }
  };

  const openEditModal = (aircraft) => {
    setIsEditMode(true);
    setModalData({
      id: aircraft.id,
      type: aircraft.type,
      airlineName: aircraft.airlineName,
      numberOfPassengers: aircraft.numberOfPassengers
    });
    const modal = new window.bootstrap.Modal(document.getElementById('aircraftModal'));
    modal.show();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setModalData({ id: null, type: '', airlineName: '', numberOfPassengers: '' });
    const modal = new window.bootstrap.Modal(document.getElementById('aircraftModal'));
    modal.show();
  };

  return (
    <div>
      <h3 className="text-center mb-3">Aircraft List</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && aircraftList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Airline Name</th>
                <th>Passenger Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aircraftList.map((aircraft) => (
                <tr key={aircraft.id}>
                  <td>{aircraft.id}</td>
                  <td>{aircraft.type}</td>
                  <td>{aircraft.airlineName}</td>
                  <td>{aircraft.numberOfPassengers}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(aircraft)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(aircraft.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={openAddModal}>
              + Add Aircraft
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center">No aircraft found.</p>
      )}

      {/* Modal */}
      <div className="modal fade" id="aircraftModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Aircraft' : 'Add Aircraft'}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="aircraftModalCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Aircraft Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.type}
                  onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Airline Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.airlineName}
                  onChange={(e) => setModalData({ ...modalData, airlineName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of Passengers</label>
                <input
                  type="number"
                  className="form-control"
                  value={modalData.numberOfPassengers}
                  onChange={(e) => setModalData({ ...modalData, numberOfPassengers: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                {isEditMode ? 'Update' : 'Add'}
              </button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AircraftTable;
