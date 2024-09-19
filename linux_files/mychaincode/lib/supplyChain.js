'use strict';
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class SupplyChainContract extends Contract {

    async initLedger(ctx) {
        console.log('Initializing the ledger with some sample data...');
        const products = [
            {
                ID: 'PROD1',
                Name: 'Product1',
                Manufacturer: 'Company A',
                CreationDate: '2023-01-01',
                ExpiryDate: '2024-01-01',
                Ingredients: 'Ingredient1, Ingredient2',
                Allergens: 'Allergen 1',
                nutritional_information: 'NI1',
                Moreinfo: ''
            },
            {
                ID: 'PROD2',
                Name: 'Product2',
                Manufacturer: 'Company B',
                CreationDate: '2023-02-01',
                ExpiryDate: '2024-02-01',
                Ingredients: 'Ingredient3, Ingredient4',
                Allergens: 'none',
                nutritional_information: 'NI2',
                Moreinfo: 'Info2'
            }
        ];

        
        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState(product.ID, Buffer.from(stringify(sortKeysRecursive(product))));
        }
    }

    async createProduct(ctx, id, name, manufacturer, creationDate, expiryDate, ingredients, allergens, nutritional_information, moreinfo) {
        console.log(`Creating product ${id}`);
        const exists = await this.ProductExists(ctx, id);
        if (exists) {
            throw new Error(`The product ${id} already exists`);
        }
        const product = {
            ID: id,
            Name: name,
            Manufacturer: manufacturer,
            CreationDate: creationDate,
            ExpiryDate: expiryDate,
            Ingredients: ingredients,
            Allergens: allergens,
            Nutritional_information: nutritional_information,
            Moreinfo: moreinfo,
            Movements: [],
            SensorData: [],
            Certifications: []
        };

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        console.log(`Product ${id} created`);
        return JSON.stringify(product)
    }

    async ReadProduct(ctx, id) {
        const productJSON = await ctx.stub.getState(id); // get the product from chaincode state
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${id} does not exist`);
        }
        return productJSON.toString();
    }
    async UpdateProduct(ctx, id, name, manufacturer, creationDate, expiryDate, ingredients, allergens, nutritional_information, moreinfo) {
        const exists = await this.ProductExists(ctx, id);
        if (!exists) {
            throw new Error(`The product ${id} does not exist`);
        }

        // overwriting original product with new product
        const updatedProduct = {
            ID: id,
            Name: name,
            Manufacturer: manufacturer,
            CreationDate: creationDate,
            ExpiryDate: expiryDate,
            Ingredients: ingredients,
            Allergens: allergens,
            Nutritional_information: nutritional_information,
            Moreinfo: moreinfo
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedProduct))));
    }

    // DeleteProduct deletes an given product from the world state.
    async DeleteProduct(ctx, id) {
        const exists = await this.ProductExists(ctx, id);
        if (!exists) {
            throw new Error(`The product ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async ProductExists(ctx, id) {
        const productJSON = await ctx.stub.getState(id);
        return productJSON && productJSON.length > 0;
    }

    async AddSensorData(ctx, id, temperature, humidity, timestamp) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Il prodotto ${id} non esiste.`);
        }
        const product = JSON.parse(productAsBytes.toString());
    
        // Aggiungi i dati del sensore alla cronologia del prodotto
        product.SensorData.push({
            Temperature: temperature,
            Humidity: humidity,
            Timestamp: timestamp
        });
    
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
        console.info(`Dati del sensore aggiunti per il prodotto ${id}.`);
    }

    async UpdateProductLocation(ctx, id, newLocation, status, date) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Il prodotto ${id} non esiste.`);
        }
        const product = JSON.parse(productAsBytes.toString());
    
        //product.Status = status;
    
        // Aggiungi il movimento alla cronologia
        product.Movements.push({
            Location: newLocation,
            Date: date,
            Status: status
        });
    
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
        console.info(`Prodotto ${id} aggiornato con successo.`);
    }

    async VerifyProductCompliance(ctx, id, maxTemperature, minHumidity) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            return JSON.stringify({
                compliant: false,
                message: `The product ${id} does not exist.`
            });
        }
    
        const product = JSON.parse(productAsBytes.toString());
    
        // Check for temperature and humidity compliance
        for (const data of product.SensorData) {
            const temperature = parseFloat(data.Temperature);
            const humidity = parseFloat(data.Humidity);
    
            if (isNaN(temperature) || isNaN(humidity)) {
                return JSON.stringify({
                    compliant: false,
                    message: `Invalid temperature or humidity data for product ${id}.`
                });
            }
    
            if (temperature > parseFloat(maxTemperature)) {
                return JSON.stringify({
                    compliant: false,
                    message: `The product ${id} has exceeded the maximum permitted temperature: ${temperature}°C.`
                });
            }
            if (humidity < parseFloat(minHumidity)) {
                return JSON.stringify({
                    compliant: false,
                    message: `The product ${id} had moisture below the required minimum: ${humidity}%.`
                });
            }
        }
    
        return JSON.stringify({
            compliant: true,
            message: `The product ${id} complies with temperature and humidity requirements.`
        });
    }
    
    
    

    async AddCertification(ctx, id, certificationType, certifyingBody, issueDate) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Il prodotto ${id} non esiste.`);
        }
        const product = JSON.parse(productAsBytes.toString());
    
        product.Certifications.push({
            CertificationType: certificationType,
            CertifyingBody: certifyingBody,
            IssueDate: issueDate
        });
    
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
        console.info(`Certification added to product ${id}.`);
    }

    async VerifyCertification(ctx, id, requiredCertificationType) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist.`);
        }
        const product = JSON.parse(productAsBytes.toString());
    
        // Check if the product has certifications
        if (!product.Certifications || product.Certifications.length === 0) {

            const res = JSON.stringify({ compliant: false, message: `Product ${id} has no certifications.` });
            return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(res))));

        }
    
        // Verify the product certification
        for (const certification of product.Certifications) {
            if (certification.CertificationType === requiredCertificationType) {
                const res = JSON.stringify({ compliant: true, message: `Product ${id} is compliant with certification: ${requiredCertificationType}.` });
                return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(res))));
            }
        }
    
        const res = JSON.stringify({ compliant: false, message: `Product ${id} is not compliant with the required certification: ${requiredCertificationType}.` });
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(res))));

    }
}

module.exports = SupplyChainContract;
