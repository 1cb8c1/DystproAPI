const express = require("express");
const { populatePoolsPromise } = require("./db/pools");
const app = express();
const authRoute = require("./auth/AuthenticationRoute");
const { verifyTokenMiddleware } = require("./auth/AuthenticationMiddleware");
const {
  checkAuthorizationMiddleware,
} = require("./auth/AuthorizationMiddleware");
const { ROLES } = require("./auth/Roles");
const productsController = require("./products/ProductsController");
const CONFIG = require("./Config");

const listenHandler = app.listen(CONFIG.PORT, () => {
  console.log(`Listening on port ${CONFIG.PORT}...`);
});

//Could add middleware to specific route!
app.get(
  "/",
  [verifyTokenMiddleware, checkAuthorizationMiddleware(ROLES.ADMIN)],
  async (req, res) => {
    res.status(200).send("hello!");
  }
);

app.use("/auth", authRoute);
app.use("/products", productsController);

const getApp = async () => {
  await populatePoolsPromise;
  return app;
};

module.exports = {
  getApp,
  listenHandler,
};

const cleanUp = () => {
  listenHandler.close();
};

process.on("exit", cleanUp);
