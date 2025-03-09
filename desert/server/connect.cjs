const { MongoClient } = require("mongodb"); // Grabs a Mongo client object from the MongoDB library
require("dotenv").config({ path: "./config.env" }); // Accesses the .env file for environment variables

async function main() {
    const Db = process.env.ATLAS_URI;
    const client = new MongoClient(Db);

    query = {"name": "Riverside city"};

    try {
        await client.connect(); // Connects to the database
        const db = client.db("map_data"); // Access the map_data database
        const collection = db.collection("places"); // Access the places collection

        console.log("\nCollection: places");
        const documents = await collection.find(query).toArray(); // Retrieve all documents
        console.log(documents); // Print all documents in the collection
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
