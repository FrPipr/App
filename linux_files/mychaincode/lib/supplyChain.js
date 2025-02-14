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
            Moreinfo: moreinfo
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

   
}

module.exports = SupplyChainContract;
