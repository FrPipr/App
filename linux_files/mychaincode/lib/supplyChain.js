'use strict';
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class SupplyChainContract extends Contract {
    async initLedger(ctx) {
        console.log('Initializing the ledger with some sample data...');
        const products = [
            {
                "ID": "AGRI_X",
                "Name": "Organic Carrots",
                "Manufacturer": "Green Farm Co.",
                "CreationDate": "2023-03-01",
                "ExpiryDate": "2023-05-01",
                "Moreinfo": "Fresh and organic carrots harvested locally.",
                "Ingredients": "",
                "Allergens": "",
                "Nutritional_information": "",
                "HarvestDate": "2023-02-25",
                "PesticideUse": "No pesticides used",
                "FertilizerUse": "Organic",
                "CountryOfOrigin": "Canada",
                "Movements": [
                    {
                        "Location": "Farm",
                        "Status": "Harvested",
                        "Date": "2023-02-25"
                    },
                    {
                        "Location": "Packing Facility",
                        "Status": "Packed",
                        "Date": "2023-02-28"
                    },
                    {
                        "Location": "Warehouse",
                        "Status": "Stored",
                        "Date": "2023-03-01"
                    },
                    {
                        "Location": "Retail Outlet",
                        "Status": "Delivered",
                        "Date": "2023-03-05"
                    }
                ],
                "SensorData": [
                    {
                        "SensorId": "sensor_503",
                        "Temperature": 4,
                        "Humidity": 80,
                        "Timestamp": "2023-03-01T10:00:00Z"
                    }
                ],
                "Certifications": [
                    {
                        "CertificationType": "Organic",
                        "CertifyingBody": "Organic Certification Canada",
                        "IssueDate": "2023-02-15"
                    }
                ]
            },
            {
                "ID": "FIN_X",
                "Name": "Almond Milk",
                "Manufacturer": "NutraFoods Inc.",
                "CreationDate": "2023-04-01",
                "ExpiryDate": "2023-10-01",
                "Moreinfo": "Fresh almond milk made from premium almonds.",
                "Ingredients": "Almonds, Water, Sugar, Salt, Vitamin D",
                "Allergens": "Almonds",
                "Nutritional_information": "Calories: 60 per 240ml, Protein: 1g, Fat: 2.5g",
                "HarvestDate": "",
                "PesticideUse": "",
                "FertilizerUse": "",
                "CountryOfOrigin": "",
                "Movements": [
                    {
                        "Location": "Manufacturing Plant",
                        "Status": "Processed",
                        "Date": "2023-04-01"
                    },
                    {
                        "Location": "Cold Storage",
                        "Status": "Stored",
                        "Date": "2023-04-02"
                    },
                    {
                        "Location": "Retail Store",
                        "Status": "Delivered",
                        "Date": "2023-04-05"
                    }
                ],
                "SensorData": [
                    {
                        "SensorId": "sensor_504",
                        "Temperature": 4,
                        "Humidity": 50,
                        "Timestamp": "2023-04-02T12:00:00Z"
                    }
                ],
                "Certifications": [
                    {
                        "CertificationType": "Vegan",
                        "CertifyingBody": "Vegan Society",
                        "IssueDate": "2023-03-25"
                    },
                    {
                        "CertificationType": "Non-GMO",
                        "CertifyingBody": "Non-GMO Project",
                        "IssueDate": "2023-03-30"
                    }
                ]
            }
        ]
        

        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState(product.ID, Buffer.from(stringify(sortKeysRecursive(product))));
        }
    }

    async createProduct(ctx, id, name, manufacturer, creationDate, expiryDate, moreinfo, ingredients, allergens, nutritionalInformation, harvestDate, pesticideUse, fertilizerUse, countryOfOrigin, movements, sensordata, certifications) {
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
            Moreinfo: moreinfo,
            Ingredients: ingredients,
            Allergens: allergens,
            Nutritional_information: nutritionalInformation,
            HarvestDate: harvestDate,
            PesticideUse: pesticideUse,
            FertilizerUse: fertilizerUse,
            CountryOfOrigin: countryOfOrigin,
            Movements: JSON.parse(movements),
            SensorData: JSON.parse(sensordata),
            Certifications: JSON.parse(certifications)
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

    // nuova aggiunta
    async GetProductHistory(ctx, id) {
        const iterator = await ctx.stub.getHistoryForKey(id); // Ottieni la cronologia per l'asset

        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value) {
                // Res contiene le informazioni sulla transazione
                const tx = res.value;
                const record = {
                    TxId: tx.tx_id,                // ID della transazione
                    Timestamp: tx.timestamp,       // Timestamp della transazione
                    IsDeleted: tx.is_delete,       // Se l'asset è stato eliminato
                    Value: tx.value.toString('utf8') // Stato del prodotto in quella transazione
                };
                allResults.push(record);
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    async UpdateProduct(ctx, id, name, manufacturer, creationDate, expiryDate, ingredients, allergens, nutritional_information, moreinfo, harvestDate, pesticideUse, fertilizerUse, countryOfOrigin, movements, sensordata, certifications) {
        // Check if the product exists
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`The product ${id} does not exist`);
        }
    
        // Parse the existing product data
        const existingProduct = JSON.parse(productAsBytes.toString());
    
        // Update fields only if they are provided (i.e., not blank)
        const updatedProduct = {
            ID: id,
            Name: name || existingProduct.Name,
            Manufacturer: manufacturer || existingProduct.Manufacturer,
            CreationDate: creationDate || existingProduct.CreationDate,
            ExpiryDate: expiryDate || existingProduct.ExpiryDate,
            Moreinfo: moreinfo || existingProduct.Moreinfo,
            Ingredients: ingredients || existingProduct.Ingredients,
            Allergens: allergens || existingProduct.Allergens,
            Nutritional_information: nutritional_information || existingProduct.Nutritional_information,
            HarvestDate: harvestDate || existingProduct.HarvestDate,
            PesticideUse: pesticideUse || existingProduct.PesticideUse,
            FertilizerUse: fertilizerUse || existingProduct.FertilizerUse,
            CountryOfOrigin: countryOfOrigin || existingProduct.CountryOfOrigin,
            Movements: movements ? JSON.parse(movements) : existingProduct.Movements,
            SensorData: sensordata ? JSON.parse(sensordata) : existingProduct.SensorData,
            Certifications: certifications ? JSON.parse(certifications) : existingProduct.Certifications
        };
    
        // Insert the updated product into the ledger in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedProduct))));
    
        // Return the updated product as a JSON string
        return JSON.stringify(updatedProduct);
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

    async AddSensorData(ctx, id, sensor_id, temperature, humidity, timestamp) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Il prodotto ${id} non esiste.`);
        }
        const product = JSON.parse(productAsBytes.toString());

        // Aggiungi i dati del sensore alla cronologia del prodotto
        product.SensorData.push({
            SensorId: sensor_id,
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

        // Aggiungi il movimento alla cronologia
        product.Movements.push({
            Location: newLocation,
            Date: date,
            Status: status
        });

        product.Status = status

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
        console.info(`Prodotto ${id} aggiornato con successo.`);
    }

    async AddCertification(ctx, id, certificationType, certifyingBody, issueDate) {
        // Retrieve the product data from the state
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist.`);
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

    /*async VerifyCertification(ctx, id, requiredCertificationType) {
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
    }*/

    async GetAllMovements(ctx, id) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist.`);
        }
        const product = JSON.parse(productAsBytes.toString());
        return JSON.stringify(product.Movements);
    }

    async GetAllSensorData(ctx, id) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist.`);
        }
        const product = JSON.parse(productAsBytes.toString());
        return JSON.stringify(product.SensorData);
    }

    async GetAllCertifications(ctx, id) {
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist.`);
        }
        const product = JSON.parse(productAsBytes.toString());
        return JSON.stringify(product.Certifications);
    }
}

module.exports = SupplyChainContract;
