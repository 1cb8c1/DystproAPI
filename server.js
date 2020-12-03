const express = require("express");
const { populatePoolsPromise } = require("./db/pools");
const authRoute = require("./auth/AuthenticationRoute");
const { verifyTokenMiddleware } = require("./auth/AuthenticationMiddleware");
const {
  checkAuthorizationMiddleware,
} = require("./auth/AuthorizationMiddleware");
const { ROLES } = require("./auth/Roles");
const productsRoute = require("./products/ProductsRoute");
const CONFIG = require("./Config");
const helmet = require("helmet");
const pools = require("./db/pools");

const app = express();
app.use(helmet());
app.set("trust proxy", true);

const listenHandler = app.listen(CONFIG.PORT, () => {
  console.log(`Listening on port ${CONFIG.PORT}...`);
});

const DBips = require("./db/ips");

//Could add middleware to specific route!
app.get("/", async (req, res) => {
  res.status(200).send("Hello world!");
});

app.use("/auth", authRoute);
app.use("/products", productsRoute);

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
