import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Form } from 'react-bootstrap';

// GLB Model component for rendering 3D model
const GLBModel = ({ url, fileBlob }) => {
    const [model, setModel] = useState(null);
    const [internalUrl, setInternalUrl] = useState(null); // URL generato dal blob se esiste

    useEffect(() => {
        const loader = new GLTFLoader();

        // Usa il fileBlob se presente, altrimenti il normale URL
        if (fileBlob) {
            const blobUrl = URL.createObjectURL(fileBlob);
            setInternalUrl(blobUrl); // Salva l'URL per liberarlo successivamente
            loader.load(blobUrl, (gltf) => {
                setModel(gltf.scene);
            }, undefined, (error) => console.error('Error loading GLB model:', error));

            return () => {
                URL.revokeObjectURL(blobUrl); // Rilascia l'URL quando il componente si smonta
            };
        } else if (url) {
            loader.load(url, (gltf) => {
                setModel(gltf.scene);
            }, undefined, (error) => console.error('Error loading GLB model:', error));
        }
    }, [url, fileBlob]);

    return model ? <primitive object={model} scale={9} position={[0, 0, 0]} /> : null;
};

const Viewer3D = ({ onGlbUpload, externalGlbFile }) => {
    const [glbUrl, setGlbUrl] = useState(null);

    // Handle GLB file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.glb')) {
            const url = URL.createObjectURL(file);
            setGlbUrl(url);
            onGlbUpload(url);
        } else {
            alert("Please upload a valid .glb file.");
        }
    };

    return (
        <div>
            {/* GLB File Upload */}
            {!externalGlbFile &&
                <Form.Group controlId="glbFile" className="d-flex align-items-center mb-3">
                    <Form.Label style={{ width: "30%" }} className="me-3">3D Model (GLB)</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileUpload}
                        accept=".glb"
                    />
                </Form.Group>
            }

            {(glbUrl || externalGlbFile) && (
                <Canvas style={{ height: "400px", background: '#f0f0f0', borderRadius: " 1vw" }}>
                    {/* Ambient Light */}
                    <ambientLight intensity={0.7} />
                    {/* Directional Light */}
                    <directionalLight position={[5, 10, 5]} intensity={1.2} />
                    {/* Environment for natural lighting */}
                    <Environment preset="sunset" />
                    {/* Orbit Controls */}
                    <OrbitControls enableZoom={true} maxDistance={20} minDistance={1} autoRotate={true} />
                    {/* GLB Model */}
                    <GLBModel url={glbUrl} fileBlob={externalGlbFile} />
                </Canvas>
            )}
        </div>
    );
};

export default Viewer3D;
