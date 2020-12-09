//IMPORTS
const express = require("express");
const CONFIG = require("./Config");
const helmet = require("helmet");
const pools = require("./src/db/pools");
//ROUTES IMPORTS
const authRoute = require("./src/routes/AuthenticationRoute");
const productsRoute = require("./src/routes/ProductsRoute");
const driversRoute = require("./src/routes/DriversRoute");

//SETTING UP APP
const app = express();
app.use(helmet()); //Helps securing app
app.set("trust proxy", true); //Trusting proxy provided by azure

const listenHandler = app.listen(CONFIG.PORT, () => {
  console.log(`Listening on port ${CONFIG.PORT}...`);
});

//ROOT
app.get("/", async (req, res) => {
  res.status(200).send("Server is alive!");
});

//USING ROUTES
app.use("/auth", authRoute);
app.use("/products", productsRoute);
app.use("/drivers", driversRoute);

//GETAPP, USED TO GET INSTANCE IN TESTS
const getApp = async () => {
  await pools.populatePoolsPromise;
  return app;
};

//SHUTTING DOWN APP
const shutDown = () => {
  console.log("Shutting down");
  listenHandler.close(() => {});
  pools.cleanUp();
};
process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
process.on("uncaughtException", shutDown);

//EXPORTS
module.exports = {
  getApp,
  listenHandler,
  shutDown,
};
