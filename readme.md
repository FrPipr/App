<h1>Product Traceability Platform</h1>

This platform is designed to ensure transparent and secure management of product data within a Hyperledger Fabric blockchain network. It allows users to interact with product information via a modern web interface, offering advanced features such as QR code scanning, 3D product models, and a comprehensive history of modifications with immutable timestamps.

<h2>Key Features</h2>
<li>Insert Agricultural or Finished products</li>
<li>Upload 3D models</li>
<li>CRUD Operations on Products</li>
<li>User Authentication and Authorization</li>
<li>Secure login and registration using JWT-based authentication.</li>
<li>QR Code Scanning</li>
<li>Product History and Modifications</li>
<br/>
The platform stores and retrieves product data securely using Hyperledger Fabric.
All blockchain interactions are facilitated by a backend server acting as a bridge to the network.

<h2>System Architecture</h2>
The platform consists of the following components:

Frontend: A React-based web application that provides intuitive features for scanning QR codes, adding products, and visualizing data.
Backend: A Flask server that handles API calls, verifies user permissions, and interacts with the blockchain network.
Blockchain Network: Built with Hyperledger Fabric and Docker, it ensures secure, immutable storage of product data.
Smart Contracts (Chaincode): Manage business logic, including product modifications, history tracking, and user permissions.

<h2>How It Works</h2>
Users interact with the platform via the web interface, where they can log in, scan QR codes, or manage products.
Authentication ensures only authorized users can perform sensitive actions.
Product data is retrieved from the blockchain through GET requests sent from the backend to the Hyperledger Fabric network.-
Any modifications to product data are validated by the backend and recorded immutably on the blockchain with a timestamp.
QR codes and 3D models provide users with an enhanced experience for understanding product details.
