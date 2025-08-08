import React, { useEffect, useState } from 'react';

function EntityTable({ entity }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/${entity}s`) // plural form
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, [entity]);

  return (
    <div>
      <h3 className="text-center mb-3">{entity.charAt(0).toUpperCase() + entity.slice(1)} List</h3>
      {data.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((val, i) => (
                    <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No {entity}s found.</p>
      )}
    </div>
  );
}

export default EntityTable;
