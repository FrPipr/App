import React, { useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const ProductList = ({ onProductSelect }) => {
  const [itemCode, setItemCode] = useState(''); // State to store item code input
  const [message, setMessage] = useState(''); // State to store messages
  const [product, setProduct] = useState(null); // State to store product details

  // Handle scanning the product and fetching its details
  const handleScan = async () => {
    try {
      // Fetch product details from the server
      const response = await axios.get(`http://127.0.0.1:5000/getProduct?productId=${itemCode}`);
      
      if (response.status === 200) {
        setProduct(response.data); // Set product details in state
        setMessage(`Product ${itemCode} found!`); // Success message
        onProductSelect(itemCode); // Pass the product ID to parent (if needed)
      } else {
        setMessage('Product not found.');
      }
    } catch (error) {
      setMessage('Failed to fetch product details.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title">Scan Product</h3>
              <div className="form-group">
                <label htmlFor="itemCode">Enter Product Item Code</label>
                <input 
                  type="text"
                  className="form-control"
                  id="itemCode"
                  placeholder="e.g. 12345"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                />
              </div>
              <button className="btn btn-primary mt-3 w-100" onClick={handleScan}>Scan Product</button>
              {message && <p className="mt-3 text-muted">{message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Display product details in a table if the product is found */}
      {product && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title">General Information</h4>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>{product.Name}</td>
                    </tr>
                    <tr>
                      <th>ID</th>
                      <td>{product.ID}</td>
                    </tr>
                    <tr>
                      <th>Manufacturer</th>
                      <td>{product.Manufacturer}</td>
                    </tr>
                    <tr>
                      <th>Creation Date</th>
                      <td>{product.CreationDate}</td>
                    </tr>
                    <tr>
                      <th>Expiry Date</th>
                      <td>{product.ExpiryDate}</td>
                    </tr>
                    <tr>
                      <th>Ingredients</th>
                      <td>{product.Ingredients}</td>
                    </tr>
                    <tr>
                      <th>Nutritional Information</th>
                      <td>{product.Nutritional_information}</td>
                    </tr>
                    <tr>
                      <th>Allergens</th>
                      <td>{product.Allergens}</td>
                    </tr>
                    <tr>
                      <th>More Information</th>
                      <td>{product.Moreinfo || 'No additional information'}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{product.Status || 'No status available'}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
