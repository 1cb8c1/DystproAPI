const express = require("express");
const { populatePoolsPromise } = require("./db/pools");
const app = express();
const authController = require("./auth/AuthenticationController");
const { verifyToken } = require("./auth/Token");
const { checkAuthorization } = require("./auth/Authorization");
const { ROLES } = require("./auth/Roles");

const listenHandler = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

//Could add middleware to specific route!
app.get(
  "/",
  [verifyToken, checkAuthorization(ROLES.ADMIN)],
  async (req, res) => {
    res.status(200).send("hello!");
  }
);

app.use("/auth", authController);

const getApp = async () => {
  await populatePoolsPromise;
  return app;
};

module.exports = {
  getApp,
  listenHandler,
};
