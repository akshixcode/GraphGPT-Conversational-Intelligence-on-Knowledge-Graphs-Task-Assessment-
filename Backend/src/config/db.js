const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("LLMGraphDB");

app.locals.db = db;