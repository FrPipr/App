import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Button } from 'react-bootstrap';
import AddCertification from './update_prod/AddCertification';

function Certifications({ productId }) {
  const [certifications, setCertifications] = useState([]);
  const [showAddCertification, setShowAddCertification] = useState(false); // State to show/hide AddCertification
  const [productManufacturer, setProductManufacturer] = useState('')

  // Fetch certifications when component mounts or productId changes
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/getAllCertifications?productId=${productId}`)
      .then((response) => {
        setCertifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching certifications:", error);
      });
    setShowAddCertification(false)
    // fetch product manufacturer
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

  // Function to add a new certification to the list
  const addCertification = (newCertification) => {
    setCertifications((prevCertifications) => [...prevCertifications, newCertification]);
    setShowAddCertification(false); // Hide AddCertification after adding
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <br />
            <h3>Certifications ✅</h3>
            <Card.Body>
              {certifications.length > 0 ? (
                <ListGroup style={{maxHeight: "20vw", overflowY:"auto"}}>
                  {certifications.map((cert, index) => (
                    <ListGroup.Item key={index}>
                      <strong>Type:</strong> {cert.CertificationType || cert.certificationType}<br />
                      <strong>Certifying Body:</strong> {cert.CertifyingBody || cert.certifyingBody}<br />
                      <strong>Issue Date:</strong> {cert.IssueDate || cert.issueDate}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <ListGroup>
                  <ListGroup.Item>No certifications available for this product.</ListGroup.Item>
                </ListGroup>
              )}

              {productManufacturer == localStorage.getItem("manufacturer") ?
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1vw",
                    marginTop: showAddCertification? "4vw" : "2vw"
                  }}
                >
                  {showAddCertification ? <h4>👇 Add Certification</h4> : null}
                  <Button
                    variant="primary"
                    onClick={() => setShowAddCertification(!showAddCertification)}
                    style={{ backgroundColor: showAddCertification ? "darkgray" : "#a6d05f", border: 0 }}
                  >
                    {showAddCertification ? 'Cancel' : 'Add Certification'}
                  </Button>
                </div>
                :
                null
              }
              {showAddCertification && productManufacturer == localStorage.getItem("manufacturer") ?
                <AddCertification productId={productId} onAddCertification={addCertification} />
                :
                null
              }
            </Card.Body>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certifications;
