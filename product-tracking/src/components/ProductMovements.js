import React from 'react';

const ProductMovements = ({ movements }) => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title">Product Movements</h3>
              <ul className="list-group">
                {movements.length > 0 ? (
                  movements.map((movement) => (
                    <li key={movement.id} className="list-group-item">
                      <strong>{movement.Location}</strong> - {movement.Date} - {movement.Status}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No movements available.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMovements;
