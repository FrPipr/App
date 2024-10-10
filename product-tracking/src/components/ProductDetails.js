import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddMovement from './AddMovement';
import ProductMovements from './ProductMovements';
import UpdateProduct from './UpdateProduct';

const ProductDetails = ({ productId }) => {
  const [movements, setMovements] = useState([]);

  // Fetch movements from the server
  const fetchMovements = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/getAllMovements?productId=${productId}`);
      setMovements(response.data);
    } catch (error) {
      console.error('Failed to fetch movements', error);
    }
  }, [productId]);

  // Fetch movements when the component mounts or productId changes
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  // Function to add a movement and refresh the list
  const addMovement = (newMovement) => {
    setMovements((prevMovements) => [...prevMovements, newMovement]);
  };

  return (
    <div className="container mt-5">
      <h1>Product Details</h1>
      {
      //<AddMovement productId={productId} onAddMovement={addMovement} /> 
      } 
      <UpdateProduct productId={productId} /> 
      <ProductMovements movements={movements} />
    </div>
  );
};

export default ProductDetails;
