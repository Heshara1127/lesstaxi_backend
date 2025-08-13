const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_PATH = path.join(__dirname, "data", "deals.json");

function readDeals() {
  const raw = fs.readFileSync(DATA_PATH);
  return JSON.parse(raw);
}

app.get("/api/deals", (req, res) => {
  const deals = readDeals();
  res.json(deals);
});

app.post("/api/deals", (req, res) => {
  const deals = readDeals();
  const newDeal = { id: Date.now(), ...req.body };
  deals.unshift(newDeal);
  fs.writeFileSync(DATA_PATH, JSON.stringify(deals, null, 2));
  res.status(201).json(newDeal);
});

app.put("/api/deals/:id", (req, res) => {
  const id = Number(req.params.id);
  const deals = readDeals();
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) return res.status(404).end();
  deals[idx] = { ...deals[idx], ...req.body };
  fs.writeFileSync(DATA_PATH, JSON.stringify(deals, null, 2));
  res.json(deals[idx]);
});

app.delete("/api/deals/:id", (req, res) => {
  const id = Number(req.params.id);
  let deals = readDeals();
  deals = deals.filter((d) => d.id !== id);
  fs.writeFileSync(DATA_PATH, JSON.stringify(deals, null, 2));
  res.json({ success: true });
});

app.listen(4000, () => console.log("Backend running on port 4000"));
