import React, { useEffect, useState } from 'react';

function AirportTable() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalData, setModalData] = useState({ id: null, name: '', code: '', cityId: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/airport');
      const data = await res.json();
      setAirports(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load airports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this airport?')) return;
    try {
      await fetch(`http://localhost:8080/airport/${id}`, { method: 'DELETE' });
      fetchAirports();
    } catch (err) {
      console.error(err);
      alert('Failed to delete airport.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `http://localhost:8080/airport/${modalData.id}`
      : 'http://localhost:8080/airport';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modalData.name,
          code: modalData.code,
          city: { id: parseInt(modalData.cityId) },
        }),
      });

      setModalData({ id: null, name: '', code: '', cityId: '' });
      setIsEditMode(false);
      document.getElementById('airportModalCloseBtn').click();
      fetchAirports();
    } catch (err) {
      console.error(err);
      alert('Failed to save airport.');
    }
  };

  const openEditModal = (airport) => {
    setIsEditMode(true);
    setModalData({
      id: airport.id,
      name: airport.name,
      code: airport.code,
      cityId: airport.city?.id || '',
    });
    const modal = new window.bootstrap.Modal(document.getElementById('airportModal'));
    modal.show();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setModalData({ id: null, name: '', code: '', cityId: '' });
    const modal = new window.bootstrap.Modal(document.getElementById('airportModal'));
    modal.show();
  };

  return (
    <div>
      <h3 className="text-center mb-3">Airport List</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && airports.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport) => (
                <tr key={airport.id}>
                  <td>{airport.id}</td>
                  <td>{airport.code}</td>
                  <td>{airport.name}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(airport)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(airport.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={openAddModal}>
              + Add Airport
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center">No airports found.</p>
      )}

      {/* Bootstrap Modal */}
      <div className="modal fade" id="airportModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Airport' : 'Add Airport'}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="airportModalCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Airport Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.code}
                  onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
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

export default AirportTable;
