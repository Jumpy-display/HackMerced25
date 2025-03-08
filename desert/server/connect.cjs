const{MongoClient} = require("mongodb") //grabs a mongo client object from the mongodb library that we installed earlier
require("dotenv").config({path: "./config.env"}) //accesses the .env library that we just installed and tells it to look at config.env file for our environment area

async function main(){
    const Db = process.env.ATLAS_URI
    const client = new MongoClient(Db)

    // await client.connect() //this function is not instatous also does connect to the database

    // const collections = await client.db("ToDoApp").collections() //test function. This will grab all the collections from the ToDoApp database
    // collections.forEach((collection) => console.log(collection.s.namespace.collection)) //will print off everything in collection

    try{
        await client.connect() //this function is not instatous also does connect to the database

        const collections = await client.db("map_data").collections() //test function. This will grab all the collections from the ToDoApp database
        collections.forEach((collection) => console.log(collection.s.namespace.collection)) //will print off everything in collection
    } catch(e) {
        console.error(e)
    } finally {
        await client.close()
    }
}

main() 