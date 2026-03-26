const express = require("express");
const router = express.Router();
const { buildGraph } = require("../services/graphService");

router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const graph = await buildGraph(db);
  res.json(graph);
});

module.exports = router;