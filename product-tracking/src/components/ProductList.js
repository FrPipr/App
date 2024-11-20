import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table } from 'react-bootstrap';
import UpdateProduct from './update_prod/UpdateProduct';
import { QRCodeCanvas } from 'qrcode.react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import Viewer3D from './Viewer3D';

const ProductList = ({ onProductSelect }) => {
  const [itemCode, setItemCode] = useState('');
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [status, setStatus] = useState('');
  const [showCamera, setShowCamera] = useState('false');
  const [scan, setScan] = useState(0);
  const [glbFile, setGlbFile] = useState(null);

  // Handle scanning the product and fetching its details
  const handleScan = async (e) => {
    e?.preventDefault();
    try {
      console.log("Scanning for Item Code: " + itemCode);

      // Fetch product details from the server
      const response = await axios.get(`http://127.0.0.1:5000/getProduct?productId=${itemCode}`);
      const historyResponse = await axios.get(`http://127.0.0.1:5000/getProductHistory?productId=${itemCode}`);

      if (response.status === 200) {
        setProduct(response.data); // Set product details in state
        setMessage(`Product ${itemCode} found!`);
        console.log(`Product ${itemCode} found!`);
        onProductSelect(itemCode);
        setProductHistory(historyResponse.data || "");
      } else {
        setMessage('Product not found.');
        setProduct(null);
        onProductSelect(null);
      }
    } catch (error) {
      setMessage('Failed to fetch product details.');
      setProduct(null);
      onProductSelect(null);
    }

    // Fetch the GLB model using the itemCode from the product
    try {
      const modelResponse = await axios.get(`http://127.0.0.1:5000/getModel?productId=${itemCode}`);

      if (modelResponse.status === 200) {
        const base64Model = modelResponse.data.ModelBase64;

        const byteCharacters = atob(base64Model.split(',')[1]);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        const glbBlob = new Blob([byteArray], { type: 'application/octet-stream' });
        setGlbFile(glbBlob);

        console.log('GLB model loaded successfully!');
      } else {
        console.log('Failed to fetch GLB model.');
        setGlbFile(null);
      }
    } catch (error) {
      console.error("Error fetching model: ", error);
      setGlbFile(null);
    }

    // Retrieve product movements
    try {
      const movementsResponse = await axios.get(`http://127.0.0.1:5000/getAllMovements?productId=${itemCode}`);
      if (movementsResponse.status === 200) {
        const movementsFound = movementsResponse.data;
        setStatus(movementsFound[movementsFound.length - 1]?.Status || "");
      } else {
        setStatus("");
      }
    } catch (error) {
      setStatus("");
    }
  };

  const getLastUpdate = () => {
    if (productHistory.length > 0) {
      const lastUpdate = productHistory[productHistory.length - 1].Timestamp;
      const date = new Date(lastUpdate.seconds * 1000 + lastUpdate.nanos / 1000000);
      return date.toLocaleString();
    }
    return null;
  };

  const getFirstUpdate = () => {
    if (productHistory.length > 0) {
      const firstUpdate = productHistory[0].Timestamp;
      const date = new Date(firstUpdate.seconds * 1000 + firstUpdate.nanos / 1000000);
      return date.toLocaleString();
    }
    return null;
  };

  // Scarica un file di testo contenente la cronologia del prodotto
  const handleDownloadHistoryLog = () => {
    const history = productHistory;
    let logContent = `Product History for ID: ${itemCode}\n\n`;

    history.forEach((item, index) => {
      const date = new Date(item.Timestamp.seconds * 1000).toLocaleString();
      const valueData = JSON.parse(item.Value);

      logContent += `Transaction ${index + 1}\n`;
      logContent += `Date and Time: ${date}\n`;
      logContent += `ID: ${valueData.ID}\n`;
      logContent += `Name: ${valueData.Name}\n`;
      logContent += `Manufacturer: ${valueData.Manufacturer}\n`;
      logContent += `Creation Date: ${valueData.CreationDate}\n`;
      logContent += `Expiry Date: ${valueData.ExpiryDate}\n`;
      logContent += `More Information: ${valueData.Moreinfo || 'No additional information'}\n\n`;
      logContent += `Ingredients: ${valueData.Ingredients}\n`;
      logContent += `Nutritional Information: ${valueData.Nutritional_information || 'N/A'}\n`;
      logContent += `Allergens: ${valueData.Allergens || 'N/A'}\n`;
      logContent += `Harvest Date: ${valueData.HarvestDate}\n`;
      logContent += `Pesticide Use: ${valueData.PesticideUse || 'N/A'}\n`;
      logContent += `Fertilizer Use: ${valueData.FertilizerUse || 'N/A'}\n`;
      logContent += `Country Of Origin: ${valueData.CountryOfOrigin || 'N/A'}\n`;
    });

    const blob = new Blob([logContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${itemCode}_product_history.txt`;

    link.click();
  };

  // Funzione per decodificare immagini caricate
  const handleImageUpload = (event) => {
    console.log("starting QR code processing...");
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, img.width, img.height);
          if (code) {
            console.log(code.data);
            document.getElementById("itemCode").value = code.data;
            setItemCode(code.data);
            setScan(scan + 1); // trigger scan
          } else {
            console.log('No QR code found in uploaded image.');
            setMessage('No QR code found in uploaded image.');
          }
        };
      };
      reader.readAsDataURL(file);
      setShowCamera(false);
      document.getElementById("uploader").value = "";
    }
  };

  // Funzione per gestire la scansione dalla fotocamera
  const handleQrScan = (data) => {
    if (data) {
      console.log(data.text);
      document.getElementById("itemCode").value = data.text;
      setItemCode(data.text);
      setScan(scan + 1); // trigger scan
      setShowCamera(false);
    }
  };

  // Avvia scansione al trigger
  useEffect(() => {
    if (scan > 0) handleScan();
  }, [scan]);

  const handleError = (err) => {
    console.error("QR code scan error:", err);
  };

  return (
    <div className="container mt-5">
      {/* Form di inserimento Item Code */}
      <form
        id="scanningForm"
        onSubmit={(e) => handleScan(e)}
        className="row justify-content-center"
      >
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <Card.Header>
                <h4>Scan Product 🔎</h4>
                <p style={{ color: "grey" }}>
                  🔗 Insert the item code manually or either scan/upload a QR code
                </p>
              </Card.Header>
              <br />
              <div className="form-group d-flex align-items-center">
                <input
                  type="text"
                  onChange={(e) => setItemCode(e.target.value)}
                  className="form-control me-2"
                  id="itemCode"
                  placeholder="Enter product Item Code"
                />
                <input
                  type="file"
                  id="uploader"
                  onChange={handleImageUpload}
                  onError={handleError}
                  onClick={() => setShowCamera(false)}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="uploader"
                  className="btn btn-secondary me-1"
                  style={{ backgroundColor: "silver", border: 0 }}
                >
                  <ion-icon name="cloud-upload-outline"></ion-icon><i className="ion-ios-upload" />
                </label>
                <div
                  className="btn btn-secondary"
                  title="Scan QR Code"
                  style={{ backgroundColor: "silver", border: 0 }}
                  onClick={() => setShowCamera(!showCamera)}
                >
                  <ion-icon name="camera-outline"></ion-icon>
                </div>
              </div>
              {showCamera === true ? (
                <QrScanner
                  style={{ width: "100%", paddingTop: "2vw" }}
                  delay={300}
                  onError={handleError}
                  onScan={handleQrScan}
                />
              ) : null}
              <input
                type="submit"
                className="btn btn-primary mt-3 w-100"
                id="scanButton"
                value="Scan Product"
              />
              {message && <p className="mt-3 text-muted">{message}</p>}
            </div>
          </div>
        </div>
      </form>

      {/* Display product details if the product is found */}
      {product && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title">General Information ℹ️</h4>
                {glbFile ? (
                  <div style={{ marginBlock: "2vw" }}>
                    <Viewer3D externalGlbFile={glbFile} />
                  </div>
                ) : (
                  <p style={{ color: "grey" }}>no 3D preview available</p>
                )}
                <Table striped bordered hover>
                  <tbody>
                    {product.Name && (
                      <tr>
                        <th>Name</th>
                        <td>{product.Name}</td>
                      </tr>
                    )}
                    {product.ID && (
                      <tr>
                        <th>ID</th>
                        <td>{product.ID}</td>
                      </tr>
                    )}
                    {product.Manufacturer && (
                      <tr>
                        <th>Manufacturer</th>
                        <td>{product.Manufacturer}</td>
                      </tr>
                    )}
                    {product.CreationDate && (
                      <tr>
                        <th>Creation Date</th>
                        <td>{product.CreationDate}</td>
                      </tr>
                    )}
                    {product.ExpiryDate && (
                      <tr>
                        <th>Expiry Date</th>
                        <td>{product.ExpiryDate}</td>
                      </tr>
                    )}
                    {product.Moreinfo && (
                      <tr>
                        <th>More Information</th>
                        <td>{product.Moreinfo}</td>
                      </tr>
                    )}
                    {product.Ingredients && (
                      <tr>
                        <th>Ingredients</th>
                        <td>{product.Ingredients}</td>
                      </tr>
                    )}
                    {product.Nutritional_information && (
                      <tr>
                        <th>Nutritional Information</th>
                        <td>{product.Nutritional_information}</td>
                      </tr>
                    )}
                    {product.Allergens && (
                      <tr>
                        <th>Allergens</th>
                        <td>{product.Allergens}</td>
                      </tr>
                    )}
                    {product.HarvestDate && (
                      <tr>
                        <th>Harvest Date</th>
                        <td>{product.HarvestDate}</td>
                      </tr>
                    )}
                    {product.PesticideUse && (
                      <tr>
                        <th>Pesticide Use</th>
                        <td>{product.PesticideUse}</td>
                      </tr>
                    )}
                    {product.FertilizerUse && (
                      <tr>
                        <th>Fertilizer Use</th>
                        <td>{product.FertilizerUse}</td>
                      </tr>
                    )}
                    {product.CountryOfOrigin && (
                      <tr>
                        <th>Country Of Origin</th>
                        <td>{product.CountryOfOrigin}</td>
                      </tr>
                    )}
                    <tr>
                      <th>Status</th>
                      <td>{status || 'No status available'}</td>
                    </tr>
                    <tr>
                      <th>N. Updates *</th>
                      <td>{productHistory.length}</td>
                    </tr>
                    <tr>
                      <th>Creation Date *</th>
                      <td>{getLastUpdate() || 'No updates available'}</td>
                    </tr>
                    <tr>
                      <th>Last Update *</th>
                      <td>{getFirstUpdate() || 'No updates available'}</td>
                    </tr>
                  </tbody>
                </Table>
                <QRCodeCanvas value={product.ID} style={{ marginBottom: "2vw" }} />
                <p>
                  Note: The data marked with <b>(*)</b> is generated automatically by the server through the blockchain,
                  ensuring transparency and reliability.
                  These values are not provided by the manufacturer.
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleDownloadHistoryLog}
                >
                  Click here to see all the product updates
                </button>
              </div>
            </div>
          </div>
          { product.Manufacturer == localStorage.getItem("manufacturer") &&
            <UpdateProduct 
          productId={itemCode} 
          productType={{"Ingredients": product.Ingredients, "HarvestDate": product.HarvestDate}}
          onProductUpdate={handleScan} 
          />}
        </div>
      )}
    </div>
  );
};

export default ProductList;
