const express = require("express");
const { closePool, createPool, getPool, P_OWNER } = require("./db/pools");
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

app.get("/", async (req, res) => {
  const pool = getPool(P_OWNER);

  const request = pool.request();
  const result = await request.query("SELECT * FROM users");
  res.send(result);
});
