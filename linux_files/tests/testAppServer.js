const request = require('supertest');
const sinon = require('sinon');
const app = require('../myapp/src/appServer');
const { connect } = require('@hyperledger/fabric-gateway');
const { expect } = import('chai');

describe('Express API Tests', () => {
    let gatewayMock;

    beforeEach(() => {
        gatewayMock = sinon.stub(connect, 'getNetwork');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get product details', (done) => {
        request(app)
            .get('/readProduct')
            .query({ productId: 'PROD1' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('ID', 'PROD1');
                done();
            });
    });

    it('should create a new product', (done) => {
        request(app)
            .post('/uploadProduct')
            .send({ ID: 'PROD2', Name: 'Product2', Manufacturer: 'Company B' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.equal('Product created successfully');
                done();
            });
    });

    it('should add sensor data to a product', (done) => {
        request(app)
            .post('/api/product/sensor')
            .send({ id: 'PROD1', temperature: 25, humidity: 60, timestamp: '2023-01-01' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.equal('Dati del sensore aggiunti per il prodotto PROD1');
                done();
            });
    });

    it('should update product location', (done) => {
        request(app)
            .post('/api/product/movement')
            .send({ id: 'PROD1', location: 'Warehouse A', status: 'In Transit', date: '2023-01-01' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.equal('Posizione del prodotto PROD1 aggiornata con successo');
                done();
            });
    });

    it('should add a certification to a product', (done) => {
        request(app)
            .post('/api/product/certification')
            .send({ id: 'PROD1', certificationType: 'ISO9001', certifyingBody: 'Cert Body', issueDate: '2023-01-01' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.equal('Certification added to product PROD1');
                done();
            });
    });

    it('should verify product compliance', (done) => {
        request(app)
            .post('/api/product/verifyProductCompliance')
            .send({ id: 'PROD1', maxTemperature: 30, minHumidity: 50 })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.equal('The product PROD1 complies with temperature and humidity requirements.');
                done();
            });
    });
});
