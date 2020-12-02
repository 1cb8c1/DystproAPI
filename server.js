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
const helmet = require("helmet");
const pools = require("./db/pools");

app.use(helmet());

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

const shutDown = () => {
  console.log("Shutting down");
  listenHandler.close(() => {});
  pools.cleanUp();
};
process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
process.on("uncaughtException", shutDown);

module.exports = {
  getApp,
  listenHandler,
  shutDown,
};
