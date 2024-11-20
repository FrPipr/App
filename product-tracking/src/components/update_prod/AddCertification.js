import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';

function AddCertification({ productId, onAddCertification }) {
  const [certificationType, setCertificationType] = useState('');
  const [certifyingBody, setCertifyingBody] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [message, setMessage] = useState('');

  const inputWidth = "30%"; // Larghezza fissa per le etichette
  const placeholderText = "+ add new"; // Placeholder standard per i campi

  useEffect(() => {
    setCertificationType('');
    setCertifyingBody('');
    setIssueDate('');
    setMessage('');
  }, [productId]);

  // Funzione per aggiungere una nuova certificazione
  const handleAddCertification = () => {
    const data = {
      id: productId,
      certificationType,
      certifyingBody,
      issueDate,
    };

    console.log("Sending certification data:", data);
    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:5000/addCertification', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        alert(response.data.message);
        setMessage(response.data.message);

        // Aggiungere la certificazione alla lista
        onAddCertification({
          CertificationType: certificationType,
          CertifyingBody: certifyingBody,
          IssueDate: issueDate,
        });

        // Resettare i campi del modulo
        setCertificationType('');
        setCertifyingBody('');
        setIssueDate('');
      })
      .catch((error) => {
        console.error("Error adding certification:", error);
        setMessage(error.response?.data?.message || "Error adding certification. Please try again.");
      });
  };

  return (
    <Card.Body style={{ paddingBottom: "0" }}>
      <Form>
        <Form.Group controlId="CertificationType" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Certification Type</Form.Label>
          <Form.Control
            type="text"
            value={certificationType}
            onChange={(e) => setCertificationType(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        <Form.Group controlId="CertifyingBody" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Certifying Body</Form.Label>
          <Form.Control
            type="text"
            value={certifyingBody}
            onChange={(e) => setCertifyingBody(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        <Form.Group controlId="IssueDate" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Issue Date</Form.Label>
          <Form.Control
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="primary"
            onClick={handleAddCertification}
            disabled={!certificationType || !certifyingBody || !issueDate}
            style={{ width: "200px", margin:"2vw" }}
          >
            Add Certification
          </Button>
        </div>

        {message && (
          <p className="mt-3 text-muted text-center">{message}</p>
        )}
      </Form>
    </Card.Body>
  );
}

export default AddCertification;
