const express = require("express");
const { userExists } = require("./db/users");
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

app.get("/", async (req, res) => {
  /*
  const pool = getPool(P_OWNER);
  const request = pool.request();
  const result = await request.query("SELECT * FROM users");
  res.send(result);
  */
  const exists = await userExists("test@xD.pl");
  res.send(exists);
});
