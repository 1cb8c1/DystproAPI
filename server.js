const express = require("express");
const { populatePoolsPromise } = require("./db/pools");
const { userExists } = require("./db/users");
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

app.get("/", async (req, res) => {
  const exists = await userExists("test@xD.pl");
  res.send(exists);
});

const getApp = async () => {
  await populatePoolsPromise;
  return app;
};

module.exports = {
  getApp,
};
