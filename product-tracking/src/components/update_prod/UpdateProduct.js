import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import '../../App.css'
import Viewer3D from '../Viewer3D';

const UpdateProduct = ({ productId, productType, onProductUpdate }) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [nutritionalInformation, setNutritionalInformation] = useState('');
  const [moreInfo, setMoreInfo] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [pesticideUse, setPesticideUse] = useState('');
  const [fertilizerUse, setFertilizerUse] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false); // Stato per gestire la visibilità del modulo
  const [glbFile, setGlbFile] = useState('')
  const inputWidth = "30%"; // larghezza fissa per le etichette
  const placeholderText = "+ add new"; // testo del placeholder per tutti i campi

  useEffect(() => {
    setManufacturer(localStorage.getItem('manufacturer'));
  }, []);

  const resetForm = () => {
    setName('');
    setCreationDate('');
    setExpiryDate('');
    setIngredients('');
    setAllergens('');
    setNutritionalInformation('');
    setMoreInfo('');
    setMessage('');
    setShowForm(false)
    setGlbFile('')
  }

  useEffect(() => {
    resetForm()
  }, [productId]);

  // Gestire l'invio del modulo
  const handleUpdateProduct = async () => {
    // Oggetto contenente tutti i dati del prodotto da aggiornare
    const productData = {
      ID: productId,
      Name: name,
      Manufacturer: manufacturer,
      CreationDate: creationDate,
      ExpiryDate: expiryDate,
      Moreinfo: moreInfo,
      Ingredients: ingredients,
      Allergens: allergens,
      Nutritional_information: nutritionalInformation,
      HarvestDate: harvestDate,
      PesticideUse: pesticideUse,
      FertilizerUse: fertilizerUse,
      CountryOfOrigin: countryOfOrigin,
      Movements: [],
      SensorData: [],
      Certifications: []
    };

    console.log("Sending updated product data:", productData);

    // Funzione per convertire il file GLB in base64
    const convertFileToBase64 = async (glbFile) => {
      console.log("Converting blob URL to base64...");
      return fetch(glbFile)
        .then((response) => response.blob())
        .then((blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .catch((error) => {
          console.error("Error fetching blob:", error);
          throw new Error("Failed to convert blob URL to base64.");
        });
    };

    // Funzione per fare POST del modello 3D aggiornato
    const uploadModel = async () => {
      try {
        const base64File = await convertFileToBase64(glbFile);
        const postData = {
          ID: productId,
          ModelBase64: base64File,
        };
        console.log("Uploading updated model for product: " + productId);

        const token = localStorage.getItem('token');
        const response = await axios.post('http://127.0.0.1:5000/uploadModel', postData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log("Model uploaded successfully!");
      } catch (error) {
        console.error("Failed to upload model.");
      }
    };

    // Aggiornamento del prodotto e, se presente, caricamento del modello 3D
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/updateProduct', productData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage(response.data.message || 'Product updated successfully');
      alert('Product updated successfully');

      // Effettua l'upload del modello solo se è stato specificato
      if (glbFile) await uploadModel();

      // Richiama la funzione per aggiornare lo stato e reimpostare il form
      onProductUpdate();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <br />
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "1vw"
              }}
            >
              <h3>Update Product ✏️</h3>
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)} // Toggle per mostrare/nascondere il modulo
                style={{ backgroundColor: showForm ? "darkgray" : "#a6d05f", border: 0 }}
              >
                {showForm ? 'Cancel' : 'Set new fields'}
              </Button>
            </div>
            {showForm && (
              <Card.Body style={{ paddingBottom: "0" }}>
                <Form>
                  {/* Hidden Product ID */}
                  <Form.Control type="hidden" value={productId} />

                  {/* Name Field */}
                  <Form.Group controlId="name" className="d-flex align-items-center mb-3">
                    <Form.Label style={{ width: inputWidth }} className="me-3">Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={placeholderText}
                    />
                  </Form.Group>

                  {/* Creation Date Field */}
                  <Form.Group controlId="creationDate" className="d-flex align-items-center mb-3">
                    <Form.Label style={{ width: inputWidth }} className="me-3">Creation Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={creationDate}
                      onChange={(e) => setCreationDate(e.target.value)}
                      placeholder={placeholderText}
                    />
                  </Form.Group>

                  {/* Expiry Date Field */}
                  <Form.Group controlId="expiryDate" className="d-flex align-items-center mb-3">
                    <Form.Label style={{ width: inputWidth }} className="me-3">Expiry Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder={placeholderText}
                    />
                  </Form.Group>

                  {/* More Info Field */}
                  <Form.Group controlId="moreInfo" className="d-flex align-items-center mb-3">
                    <Form.Label style={{ width: inputWidth }} className="me-3">More Info</Form.Label>
                    <Form.Control
                      type="text"
                      value={moreInfo}
                      onChange={(e) => setMoreInfo(e.target.value)}
                      placeholder={placeholderText}
                    />
                  </Form.Group>

                  {/* Upload and view 3D model */}
                  <Viewer3D
                    onGlbUpload={setGlbFile}
                  />
                  <br/>

                  {productType["Ingredients"] ?
                    <div>
                      {/* Ingredients Field */}
                      < Form.Group controlId="ingredients" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Ingredients</Form.Label>
                        <Form.Control
                          type="text"
                          value={ingredients}
                          onChange={(e) => setIngredients(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>

                      {/* Allergens Field */}
                      <Form.Group controlId="allergens" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Allergens</Form.Label>
                        <Form.Control
                          type="text"
                          value={allergens}
                          onChange={(e) => setAllergens(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>

                      {/* Nutritional Information Field */}
                      <Form.Group controlId="nutritionalInformation" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Nutritional Information</Form.Label>
                        <Form.Control
                          type="text"
                          value={nutritionalInformation}
                          onChange={(e) => setNutritionalInformation(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>
                    </div>
                    :
                    <div>
                      <Form.Group controlId="harvestDate" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Harvest Date</Form.Label>
                        <Form.Control
                          type="text"
                          value={harvestDate}
                          onChange={(e) => setHarvestDate(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>
                      <Form.Group controlId="pesticideUse" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Pesticide Use</Form.Label>
                        <Form.Control
                          type="text"
                          value={pesticideUse}
                          onChange={(e) => setPesticideUse(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>
                      <Form.Group controlId="fertilizerUse" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Fertilizer Use</Form.Label>
                        <Form.Control
                          type="text"
                          value={fertilizerUse}
                          onChange={(e) => setFertilizerUse(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>
                      <Form.Group controlId="countryOfOrigin" className="d-flex align-items-center mb-3">
                        <Form.Label style={{ width: inputWidth }} className="me-3">Country of Origin</Form.Label>
                        <Form.Control
                          type="text"
                          value={countryOfOrigin}
                          onChange={(e) => setCountryOfOrigin(e.target.value)}
                          placeholder={placeholderText}
                        />
                      </Form.Group>
                    </div>
                  }

                  {/* Submit Button */}
                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      variant="primary"
                      onClick={handleUpdateProduct}
                      style={{ width: "200px", margin: "2vw" }}
                    >
                      Update Product
                    </Button>
                  </div>

                  {/* Display Message */}
                  {message && <p className="mt-3 text-muted text-center">{message}</p>}
                </Form>
              </Card.Body>
            )}
            <br />
          </div>
        </div>
      </div>
    </div >
  );
};

export default UpdateProduct;
