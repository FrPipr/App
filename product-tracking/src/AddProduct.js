import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import { QRCodeCanvas } from 'qrcode.react';
import Viewer3D from './components/Viewer3D';
import Papa from 'papaparse';  // Assicurati di avere papaparse installato

const AddProduct = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
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
  const [view, setView] = useState('');
  const [lastAdded, setLastAdded] = useState('');
  const [glbFile, setGlbFile] = useState('');
  const [productType, setProductType] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const inputWidth = "30%";
  const placeholderText = "+ add new";

  useEffect(() => {
    setManufacturer(localStorage.getItem('manufacturer'));
  }, []);

  const resetForm = () => {
    setId('');
    setName('');
    setCreationDate('');
    setExpiryDate('');
    setIngredients('');
    setAllergens('');
    setNutritionalInformation('');
    setMoreInfo('');
    setHarvestDate('');
    setPesticideUse('');
    setFertilizerUse('');
    setCountryOfOrigin('');
    setView('');
    setProductType('');
    setGlbFile('');
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();

    // Crea un oggetto con tutti i dati del prodotto
    const productData = {
      ID: id,
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

    // Funzione per recuperare il Blob da un URL e convertirlo in base64
    const convertFileToBase64 = async (glbFile) => {
      return fetch(glbFile)
        .then((response) => response.blob())  // Recupera il Blob dall'URL
        .then((blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result)
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .catch((error) => {
          console.error("Error fetching blob:", error);
          throw new Error("Failed to convert blob URL to base64.");
        });
    };

    // Funzione per fare POST del modello 3D
    const uploadModel = async () => {
      try {
        const base64File = await convertFileToBase64(glbFile);
        const postData = {
          ID: id,
          ModelBase64: base64File,
        };

        const token = localStorage.getItem('token');
        const response = await axios.post('http://127.0.0.1:5000/uploadModel', postData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Model uploaded successfully!');
        resetForm();
      } catch (error) {
        console.log('Failed to upload model.');
      }
    }

    // POST del nuovo prodotto + POST modello 3D 
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/uploadProduct', productData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('Product uploaded successfully!');
      setLastAdded(productData.ID);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to upload product. Please try again.');
    }

    if (glbFile) uploadModel();
    else resetForm();
  }

  // Gestore per il caricamento del file CSV
  const handleCsvChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setCsvFile(file);
    }
  };

  // Funzione per gestire il caricamento del CSV e inviare le richieste POST
  const handleCsvUpload = () => {
    if (!csvFile) {
      setMessage('Please upload a CSV file first.');
      return;
    }

    Papa.parse(csvFile, {
      complete: async (result) => {
        for (let row of result.data) {
          console.log(row)
          try {
            const postData = {
              ID: row[0],
              Name: row[1],
              Manufacturer: manufacturer,
              CreationDate: row[2],
              ExpiryDate: row[3],
              Moreinfo: row[4],
              Ingredients: row[5],
              Allergens: row[6],
              Nutritional_information: row[7],
              HarvestDate: row[8],
              PesticideUse: row[9],
              FertilizerUse: row[10],
              CountryOfOrigin: row[11],
              Movements: [],
              SensorData: [],
              Certifications: []
            };
            // Esegui la richiesta POST per ogni riga
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/uploadProduct', postData, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            setMessage("CSV upload completed successfully!");
          } catch (error) {
            console.error('Error posting data for row:', row, error);
            setMessage(error.response.data.message)
          }
        }
      },
      header: false, // Impostato su false se il CSV non ha intestazioni
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <Card.Header>
                <h4>Upload Product 📦</h4>
                <p style={{ color: "grey" }}>
                  ℹ️ Add your product and complete its details to enhance traceability and transparency
                  <br />
                  🖼️ Insert and visualize your product with a 3D model
                </p>
              </Card.Header>
              <br />
              {message && !view &&
                <div>
                  <p> {message} </p>
                  {lastAdded &&
                    <div>
                      <QRCodeCanvas value={lastAdded} style={{ marginBottom: "2vw" }} />
                      <p>Product ID: <b>{lastAdded}</b></p>
                    </div>
                  }
                </div>}
              {!view &&
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() => { setView('show'); setMessage('') }}
                >
                  + New Product
                </button>
              }

              {view === 'show' &&
                <Card.Body>

                  {/* CSV File Upload */}
                  <Form.Group className="d-flex align-items-center mb-3" style={{ marginTop: "1vw" }}>
                    <Form.Label style={{ width: inputWidth }} className="me-3">Upload CSV</Form.Label>
                    <Form
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2vw",
                        border: "1px dashed silver",
                        borderRadius: "1vw",
                        padding: "1vw"
                      }}
                    >
                      {csvFile ?
                        <ion-icon
                          name="trash-outline"
                          style={{ cursor: "pointer", color: "grey" }}
                          onClick={() => { document.getElementById("csvFile").value = ''; setCsvFile('') }}
                        />
                        :
                        <ion-icon name="folder-outline" style={{ color: "grey" }}></ion-icon>
                      }
                      <label htmlFor='csvFile' style={{ color: "grey", textDecoration: "underline", cursor: "pointer" }}>
                        {
                          csvFile ?
                            JSON.stringify(csvFile.name)
                            :
                            "upload data from CSV file"
                        }
                      </label>
                      <input
                        style={{ display: "none" }}
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        onChange={handleCsvChange}
                      />
                      {csvFile && <Button
                        variant="primary"
                        style={{ borderRadius: "2vw", paddingBlock: "0" }}
                        onClick={handleCsvUpload}
                        disabled={!csvFile}
                      >
                        Submit
                      </Button>}
                    </Form>
                  </Form.Group>
                  {
                    csvFile &&
                    <p>{message}</p>
                    }

                  {/* Separator */}
                  <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #666' }} />
                    <span style={{ margin: '0 10px', color: '#666', fontWeight: 'bold' }}>or</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #666' }} />
                  </div>

                  <Form onSubmit={handleUploadProduct}>
                    {/* Display basic fields */}
                    <Form.Group controlId="id" className="d-flex align-items-center mb-3">
                      <Form.Label style={{ width: inputWidth }} className="me-3">ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder={placeholderText}
                        required
                      />
                    </Form.Group>

                    {/* Name Field */}
                    <Form.Group controlId="name" className="d-flex align-items-center mb-3">
                      <Form.Label style={{ width: inputWidth }} className="me-3">Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={placeholderText}
                        required
                      />
                    </Form.Group>

                    {/* Creation and Expiry Date */}
                    <Form.Group controlId="creationDate" className="d-flex align-items-center mb-3">
                      <Form.Label style={{ width: inputWidth }} className="me-3">Creation Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={creationDate}
                        onChange={(e) => setCreationDate(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="expiryDate" className="d-flex align-items-center mb-3">
                      <Form.Label style={{ width: inputWidth }} className="me-3">Expiry Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="moreInfo" className="d-flex align-items-center mb-3">
                      <Form.Label style={{ width: inputWidth }} className="me-3">More Info</Form.Label>
                      <Form.Control
                        type="text"
                        value={moreInfo}
                        onChange={(e) => setMoreInfo(e.target.value)}
                        placeholder={placeholderText}
                      />
                    </Form.Group>

                    {/* Upload 3D Model */}

                    <div className="mb-3">
                      <Viewer3D onGlbUpload={setGlbFile} />
                    </div>

                    {/* Product Type Selection */}
                    <div className="d-flex justify-content-center mb-3" style={{ gap: "2vw" }}>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setProductType('agricultural');
                          // Reset all fields related to agricultural product
                          setHarvestDate('');
                          setPesticideUse('');
                          setFertilizerUse('');
                          setCountryOfOrigin('');
                        }}
                        style={{ color: productType === 'agricultural' && "grey", border: productType === 'agricultural' && "1.5px solid grey" }}
                      >
                        🥕 Agricultural Product
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setProductType('finished');
                          // Reset all fields related to finished product
                          setIngredients('');
                          setAllergens('');
                          setNutritionalInformation('');
                        }}
                        style={{ color: productType === 'finished' && "grey", border: productType === 'finished' && "1.5px solid grey" }}
                      >
                        🍔 Finished Product
                      </Button>
                    </div>

                    {/* Show relevant fields based on product type */}
                    {productType === 'agricultural' && (
                      <>
                        <Form.Group controlId="harvestDate" className="d-flex align-items-center mb-3">
                          <Form.Label style={{ width: inputWidth }} className="me-3">Harvest Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={harvestDate}
                            onChange={(e) => setHarvestDate(e.target.value)}
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
                      </>
                    )}

                    {productType === 'finished' && (
                      <>
                        <Form.Group controlId="ingredients" className="d-flex align-items-center mb-3">
                          <Form.Label style={{ width: inputWidth }} className="me-3">Ingredients</Form.Label>
                          <Form.Control
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder={placeholderText}
                          />
                        </Form.Group>

                        <Form.Group controlId="allergens" className="d-flex align-items-center mb-3">
                          <Form.Label style={{ width: inputWidth }} className="me-3">Allergens</Form.Label>
                          <Form.Control
                            type="text"
                            value={allergens}
                            onChange={(e) => setAllergens(e.target.value)}
                            placeholder={placeholderText}
                          />
                        </Form.Group>

                        <Form.Group controlId="nutritionalInformation" className="d-flex align-items-center mb-3">
                          <Form.Label style={{ width: inputWidth }} className="me-3">Nutritional Information</Form.Label>
                          <Form.Control
                            type="text"
                            value={nutritionalInformation}
                            onChange={(e) => setNutritionalInformation(e.target.value)}
                            placeholder={placeholderText}
                          />
                        </Form.Group>
                      </>
                    )}

                    <br />
                    <Button variant="primary" type="submit" disabled={!id || !name || !creationDate || !expiryDate || (!harvestDate && !ingredients)}>
                      Upload Product
                    </Button>
                  </Form>
                </Card.Body>
              }
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default AddProduct;
