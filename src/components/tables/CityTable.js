import React, { useEffect, useState } from 'react';
import '../styles.css';

function CityTable() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalData, setModalData] = useState({ id: null, name: '', state: '', population: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/city');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load cities.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    try {
      await fetch(`http://localhost:8080/city/${id}`, { method: 'DELETE' });
      fetchCities();
    } catch (err) {
      console.error(err);
      alert('Failed to delete city.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode
      ? `http://localhost:8080/city/${modalData.id}`
      : 'http://localhost:8080/city';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modalData.name,
          state: modalData.state,
          population: parseInt(modalData.population) || 0,
        }),
      });

      setModalData({ id: null, name: '', state: '', population: '' });
      setIsEditMode(false);
      document.getElementById('cityModalCloseBtn').click();
      fetchCities();
    } catch (err) {
      console.error(err);
      alert('Failed to save city.');
    }
  };

  const openEditModal = (city) => {
    setIsEditMode(true);
    setModalData({ ...city });
    const modal = new window.bootstrap.Modal(document.getElementById('cityModal'));
    modal.show();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setModalData({ id: null, name: '', state: '', population: '' });
    const modal = new window.bootstrap.Modal(document.getElementById('cityModal'));
    modal.show();
  };

  return (
    <div>
      <h3 className="text-center mb-3">City List</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && cities.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>State</th>
                <th>Population</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id}>
                  <td>{city.id}</td>
                  <td>{city.name}</td>
                  <td>{city.state || 'N/A'}</td>
                  <td>{city.population || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(city)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(city.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={openAddModal}>
              + Add City
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && <p className="text-center">No cities found.</p>
      )}

      {/* Bootstrap Modal */}
      <div className="modal fade" id="cityModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit City' : 'Add City'}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="cityModalCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">City Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalData.state}
                  onChange={(e) => setModalData({ ...modalData, state: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Population</label>
                <input
                  type="number"
                  className="form-control"
                  value={modalData.population}
                  onChange={(e) => setModalData({ ...modalData, population: e.target.value })}
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

export default CityTable;
