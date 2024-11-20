import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddMovement from './update_prod/AddMovement';
import { Button, Card } from 'react-bootstrap';

const ProductMovements = ({ productId }) => {
  const [movements, setMovements] = useState([]);
  const [showAddMovement, setShowAddMovement] = useState(false); // Stato per visualizzare o nascondere <AddMovement />
  const [productManufacturer, setProductManufacturer] = useState('')
  // Fetch movements from the server
  const fetchMovements = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/getAllMovements?productId=${productId}`);
      setMovements(response.data);
    } catch (error) {
      console.error('Failed to fetch movements', error);
    }
    setShowAddMovement(false)
  }, [productId]);

  // Fetch movements when the component mounts or productId changes
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  useEffect(() => {
    const getProductManufacturer = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/getProduct?productId=${productId}`);
        if (response.status === 200) {
          setProductManufacturer(response.data.Manufacturer);
        } else {
          console.log('Product not found.');
        }
      } catch (error) {
        console.log('Failed to fetch product details.');
      }
    }
    getProductManufacturer()
  }, [productId]);

  // Function to add a movement and refresh the list
  const addMovement = (newMovement) => {
    setMovements((prevMovements) => [...prevMovements, newMovement]);
    setShowAddMovement(false); // Nasconde il componente <AddMovement /> dopo l’aggiunta
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <br />
            <h3>Product Movements 🚚</h3>
            <Card.Body>
              <ul className="list-group" style={{ maxHeight: "20vw", overflowY: "auto" }}>
                {movements.length > 0 ? (
                  movements.map((movement, index) => (
                    <li key={index} className="list-group-item">
                      <strong>Location:</strong> {movement.Location}
                      <br />
                      <strong>Date:</strong> {movement.Date}
                      <br />
                      <strong>Status:</strong> {movement.Status}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No movements available.</li>
                )}
              </ul>
              {productManufacturer == localStorage.getItem("manufacturer") ?
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1vw",
                    marginTop: showAddMovement ? "4vw" : "2vw"
                  }}
                >
                  {showAddMovement ? <h4>👇 Add Movement</h4> : null}
                  <Button
                    onClick={() => setShowAddMovement(!showAddMovement)} // Toggle per mostrare o nascondere <AddMovement />
                    style={{ backgroundColor: showAddMovement ? "darkgray" : "#a6d05f", border: 0 }}
                  >
                    {showAddMovement ? 'Cancel' : 'Add New Movement'}
                  </Button>
                </div>
                :
                null
              }
              {showAddMovement && productManufacturer == localStorage.getItem("manufacturer") ?
                <AddMovement productId={productId} onAddMovement={addMovement} />
                :
                null
              }
            </Card.Body>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProductMovements;

