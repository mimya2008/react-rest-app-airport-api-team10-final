import React, { useEffect, useState } from 'react';

function AirlineTable() {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalData, setModalData] = useState({ id: null, name: '', country: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/airlines');
      const data = await res.json();
      setAirlines(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load airlines.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this airline?')) return;

    try {
      await fetch(`http://localhost:8080/airlines/${id}`, { method: 'DELETE' });
      fetchAirlines();
    } catch (err) {
      console.error(err);
      alert('Failed to delete airline.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `http://localhost:8080/airlines/${modalData.id}`
      : 'http://localhost:8080/airlines';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modalData.name,
          country: modalData.country,
        }),
      });

      setModalData({ id: null, name: '', country: '' });
      setIsEditMode(false);
      document.getElementById('airlineModalCloseBtn').click();
      fetchAirlines();
    } catch (err) {
      console.error(err);
      alert('Failed to save airline.');
    }
  };

  const openEditModal = (airline) => {
    setIsEditMode(true);
    setModalData({ ...airline });
    const modal = new window.bootstrap.Modal(document.getElementById('airlineModal'));
    modal.show();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setModalData({ id: null, name: '', country: '' });
    const modal = new window.bootstrap.Modal(document.getElementById('airlineModal'));
    modal.show();
  };

  return (
    <div>
      <h3 className="text-center mb-3">Airline List</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && airlines.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Country</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline) => (
                <tr key={airline.id}>
                  <td>{airline.id}</td>
                  <td>{airline.name}</td>
                  <td>{airline.country}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(airline)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(airline.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={openAddModal}>
              + Add Airline
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center">No airlines found.</p>
      )}

      {/* Modal */}
      <div className="modal fade" id="airlineModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Airline' : 'Add Airline'}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="airlineModalCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Airline Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.country}
                  onChange={(e) => setModalData({ ...modalData, country: e.target.value })}
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

export default AirlineTable;
