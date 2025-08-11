import React, { useEffect, useState } from 'react';

function PassengerTable() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalData, setModalData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    cityId: '',
    aircraftIds: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/passenger');
      const data = await res.json();
      setPassengers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load passengers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this passenger?')) return;
    try {
      await fetch(`http://localhost:8080/passenger/${id}`, { method: 'DELETE' });
      fetchPassengers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete passenger.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `http://localhost:8080/passenger/${modalData.id}`
      : 'http://localhost:8080/passenger';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: modalData.firstName,
          lastName: modalData.lastName,
          phoneNumber: modalData.phoneNumber,
          city: { id: parseInt(modalData.cityId) },
          aircraft: modalData.aircraftIds.split(',').map((id) => ({ id: parseInt(id.trim()) }))
        }),
      });

      setModalData({ id: null, firstName: '', lastName: '', phoneNumber: '', cityId: '', aircraftIds: '' });
      setIsEditMode(false);
      document.getElementById('passengerModalCloseBtn').click();
      fetchPassengers();
    } catch (err) {
      console.error(err);
      alert('Failed to save passenger.');
    }
  };

  const openEditModal = (passenger) => {
    setIsEditMode(true);
    setModalData({
      id: passenger.id,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      phoneNumber: passenger.phoneNumber,
      cityId: passenger.city?.id || '',
      aircraftIds: passenger.aircraft?.map((a) => a.id).join(',') || ''
    });

    const modal = new window.bootstrap.Modal(document.getElementById('passengerModal'));
    modal.show();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setModalData({
      id: null,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      cityId: '',
      aircraftIds: ''
    });

    const modal = new window.bootstrap.Modal(document.getElementById('passengerModal'));
    modal.show();
  };

  return (
    <div>
      <h3 className="text-center mb-3">Passenger List</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && passengers.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Aircraft IDs</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.firstName}</td>
                  <td>{p.lastName}</td>
                  <td>{p.phoneNumber}</td>
                  <td>{p.aircraft?.map((a) => a.id).join(', ') || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(p)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={openAddModal}>
              + Add Passenger
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center">No passengers found.</p>
      )}

      {/* Modal */}
      <div className="modal fade" id="passengerModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Passenger' : 'Add Passenger'}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="passengerModalCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.firstName}
                  onChange={(e) => setModalData({ ...modalData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.lastName}
                  onChange={(e) => setModalData({ ...modalData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.phoneNumber}
                  onChange={(e) => setModalData({ ...modalData, phoneNumber: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={modalData.cityId}
                  onChange={(e) => setModalData({ ...modalData, cityId: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Aircraft IDs (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.aircraftIds}
                  onChange={(e) => setModalData({ ...modalData, aircraftIds: e.target.value })}
                  placeholder="e.g., 1,2"
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

export default PassengerTable;
