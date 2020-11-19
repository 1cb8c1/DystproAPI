const express = require("express");
const { populatePoolsPromise } = require("./db/pools");
const app = express();
const authController = require("./auth/AuthController");

const listenHandler = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

app.get("/", async (req, res) => {
  res.send("hello!");
});

app.use("/auth", authController);

const getApp = async () => {
  await populatePoolsPromise;
  return app;
};

module.exports = {
  getApp,
  listenHandler,
};
