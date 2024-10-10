const sinon = require('sinon');
const { Context } = require('fabric-contract-api');
const assert = require('assert');  // Using Node.js assert for tests
const SupplyChainContract = require('../mychaincode/lib/supplyChain');

describe('SupplyChainContract', () => {
    let contract;
    let ctx;

    beforeEach(() => {
        contract = new SupplyChainContract();

        // Stub ctx.stub and its methods
        ctx = {
            stub: {
                getState: sinon.stub(),
                putState: sinon.stub(),
                deleteState: sinon.stub(),
            }
        };
    });

    // Test: Initializing the ledger
    it('should initialize the ledger', async () => {
        ctx.stub.putState.resolves();
        await contract.initLedger(ctx);
        sinon.assert.called(ctx.stub.putState);
    });

    // Test: Creating a new product
    it('should create a product', async () => {
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(''));
        ctx.stub.putState.resolves();

        await contract.createProduct(ctx, 'PROD1', 'Product1', 'Company A', '2023-01-01', '2024-01-01', 'Ingredient1, Ingredient2', 'Allergen 1', 'NI1', '');
        sinon.assert.calledWith(ctx.stub.putState, 'PROD1');
    });

    // Test: Reading an existing product
    it('should read an existing product', async () => {
        const product = { ID: 'PROD1', Name: 'Product1' };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));

        const result = await contract.ReadProduct(ctx, 'PROD1');
        assert.strictEqual(result, JSON.stringify(product));  // Using assert.strictEqual
    });

    // Test: Updating a product
    it('should update an existing product', async () => {
        const existingProduct = { ID: 'PROD1', Name: 'Product1' };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(existingProduct)));
        ctx.stub.putState.resolves();

        await contract.UpdateProduct(ctx, 'PROD1', 'Updated Product', 'Company A', '2023-01-01', '2024-01-01', 'Ingredient1, Ingredient2', 'Allergen 1', 'NI1', '');
        sinon.assert.calledWith(ctx.stub.putState, 'PROD1');
    });

    // Test: Deleting a product
    it('should delete a product', async () => {
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify({ ID: 'PROD1' })));
        ctx.stub.deleteState.resolves();

        await contract.DeleteProduct(ctx, 'PROD1');
        sinon.assert.calledWith(ctx.stub.deleteState, 'PROD1');
    });

    // Test: Adding sensor data to a product
    it('should add sensor data to a product', async () => {
        const product = { ID: 'PROD1', SensorData: [] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));
        ctx.stub.putState.resolves();

        await contract.AddSensorData(ctx, 'PROD1', '25', '60', '2023-01-01T12:00:00');
        sinon.assert.calledWith(ctx.stub.putState, 'PROD1');
    });

    // Test: Updating product location and status
    it('should update product location and status', async () => {
        const product = { ID: 'PROD1', Movements: [] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));
        ctx.stub.putState.resolves();

        await contract.UpdateProductLocation(ctx, 'PROD1', 'Warehouse B', 'Shipped', '2023-01-02');
        sinon.assert.calledWith(ctx.stub.putState, 'PROD1');
    });

    // Test: Verifying product compliance (temperature and humidity)
    it('should verify product compliance', async () => {
        const product = { ID: 'PROD1', SensorData: [{ Temperature: '22', Humidity: '55' }] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));

        const result = await contract.VerifyProductCompliance(ctx, 'PROD1', '30', '50');
        const complianceResult = JSON.parse(result);
        assert.strictEqual(complianceResult.compliant, true);
        assert.strictEqual(complianceResult.message, 'The product PROD1 complies with temperature and humidity requirements.');
    });

    // Test: Adding a certification to a product
    it('should add certification to a product', async () => {
        const product = { ID: 'PROD1', Certifications: [] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));
        ctx.stub.putState.resolves();

        await contract.AddCertification(ctx, 'PROD1', 'ISO9001', 'Certifying Body', '2023-01-01');
        sinon.assert.calledWith(ctx.stub.putState, 'PROD1');
    });

    // Test: Verifying product certification
    /*
    it('should verify certification for a product', async () => {
        const product = { ID: 'PROD1', Certifications: [{ CertificationType: 'ISO9001' }] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));

        const result = await contract.VerifyCertification(ctx, 'PROD1', 'ISO9001');
        const certificationResult = JSON.parse(result);
        assert.strictEqual(certificationResult.compliant, true);
        assert.strictEqual(certificationResult.message, 'Product PROD1 is compliant with certification: ISO9001.');
    });
    */
    // Test: Getting all movements of a product
    it('should return all movements for a product', async () => {
        const product = { ID: 'PROD1', Movements: [{ Location: 'Warehouse A', Date: '2023-01-01' }] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));

        const result = await contract.GetAllMovements(ctx, 'PROD1');
        assert.strictEqual(result, JSON.stringify(product.Movements));
    });

    // Test: Getting all sensor data of a product
    it('should return all sensor data for a product', async () => {
        const product = { ID: 'PROD1', SensorData: [{ Temperature: '22', Humidity: '55' }] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));

        const result = await contract.GetAllSensorData(ctx, 'PROD1');
        assert.strictEqual(result, JSON.stringify(product.SensorData));
    });

    // Test: Getting all certifications of a product
    it('should return all certifications for a product', async () => {
        const product = { ID: 'PROD1', Certifications: [{ CertificationType: 'ISO9001' }] };
        ctx.stub.getState.withArgs('PROD1').resolves(Buffer.from(JSON.stringify(product)));

        const result = await contract.GetAllCertifications(ctx, 'PROD1');
        assert.strictEqual(result, JSON.stringify(product.Certifications));
    });
});
