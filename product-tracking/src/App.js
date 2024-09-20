import React, { useState } from 'react';
import ProductList from './components/ProductList';
import DataSensors from './components/DataSensors';
import Certifications from './components/Certifications';
import ProductDetails from './components/ProductDetails';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="container">
      <h1>Product Management System</h1>
      <ProductList onProductSelect={setSelectedProduct} />

      {selectedProduct && (
        <div className="mt-4">
          <ProductDetails productId={selectedProduct} />
          <DataSensors productId={selectedProduct} />
          <Certifications productId={selectedProduct} />
        </div>
      )}
    </div>
  );
}

export default App;
