import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';

const UpdateProduct = ({ productId }) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [nutritionalInformation, setNutritionalInformation] = useState('');
  const [moreInfo, setMoreInfo] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleUpdateProduct = async () => {
    // Only include fields that have values (non-blank)
    const productData = {
        id: productId,  // Hidden field, passed from props
        name,
        manufacturer,
        creationDate,
        expiryDate,
        ingredients,
        allergens,
        nutritional_information: nutritionalInformation,
        moreinfo: moreInfo
      };

    console.log("Sending product data:", productData); // For debugging purposes

    try {
      const response = await axios.post('http://127.0.0.1:5000/updateProduct', productData);
      setMessage(response.data.message || 'Product updated successfully');
    } catch (error) {
      setMessage('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h4>Update Product</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          {/* Hidden Product ID */}
          <Form.Control
            type="hidden"
            value={productId}
          />

          {/* Name Field */}
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </Form.Group>

          {/* Manufacturer Field */}
          <Form.Group controlId="manufacturer" className="mt-3">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="Enter manufacturer"
            />
          </Form.Group>

          {/* Creation Date Field */}
          <Form.Group controlId="creationDate" className="mt-3">
            <Form.Label>Creation Date</Form.Label>
            <Form.Control
              type="text"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              placeholder="Enter creation date"
            />
          </Form.Group>

          {/* Expiry Date Field */}
          <Form.Group controlId="expiryDate" className="mt-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="Enter expiry date"
            />
          </Form.Group>

          {/* Ingredients Field */}
          <Form.Group controlId="ingredients" className="mt-3">
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients"
            />
          </Form.Group>

          {/* Allergens Field */}
          <Form.Group controlId="allergens" className="mt-3">
            <Form.Label>Allergens</Form.Label>
            <Form.Control
              type="text"
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              placeholder="Enter allergens"
            />
          </Form.Group>

          {/* Nutritional Information Field */}
          <Form.Group controlId="nutritionalInformation" className="mt-3">
            <Form.Label>Nutritional Information</Form.Label>
            <Form.Control
              type="text"
              value={nutritionalInformation}
              onChange={(e) => setNutritionalInformation(e.target.value)}
              placeholder="Enter nutritional information"
            />
          </Form.Group>

          {/* More Info Field */}
          <Form.Group controlId="moreInfo" className="mt-3">
            <Form.Label>More Info</Form.Label>
            <Form.Control
              type="text"
              value={moreInfo}
              onChange={(e) => setMoreInfo(e.target.value)}
              placeholder="Enter additional information"
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            className="mt-3"
            variant="primary"
            onClick={handleUpdateProduct}
          >
            Update Product
          </Button>

          {/* Display Message */}
          {message && <p className="mt-3 text-muted">{message}</p>}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateProduct;
