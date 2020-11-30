const express = require("express");
const { populatePoolsPromise } = require("./db/pools");
const app = express();
const authController = require("./auth/AuthenticationController");
const { verifyTokenMiddleware } = require("./auth/Token");
const {
  checkAuthorizationMiddleware,
} = require("./auth/AuthorizationMiddleware");
const { ROLES } = require("./auth/Roles");
const productsController = require("./products/ProductsController");

const listenHandler = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

//Could add middleware to specific route!
app.get(
  "/",
  [verifyTokenMiddleware, checkAuthorizationMiddleware(ROLES.ADMIN)],
  async (req, res) => {
    res.status(200).send("hello!");
  }
);

app.use("/auth", authController);
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
