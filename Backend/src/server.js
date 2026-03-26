require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
const client = new MongoClient("mongodb://127.0.0.1:27017");

async function startServer() {
  try {
    await client.connect();

    const db = client.db("LLMGraphDB");

    app.locals.db = db;

    console.log("MongoDB Connected ✅");

    app.use("/graph", require("./routes/graphRoutes"));
    app.use("/query", require("./routes/queryRoutes"));

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error(err);
  }
}

startServer();