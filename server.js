//IMPORTS
const express = require("express");
const CONFIG = require("./Config");
const helmet = require("helmet");
const pools = require("./src/db/pools");
const cors = require("cors");
//ROUTES IMPORTS
const authRoute = require("./src/routes/AuthenticationRoute");
const productsRoute = require("./src/routes/ProductsRoute");
const driversRoute = require("./src/routes/DriversRoute");
const reqeustsRoute = require("./src/routes/RequestsRoute");
const vehiclesRoute = require("./src/routes/VehiclesRoute");
const reservationsRoute = require("./src/routes/ReservationsRoute");
const dispatchesRoute = require("./src/routes/DispatchesRoute");
const distributorRoute = require("./src/routes/DistributorRoute");
const warehousesRoute = require("./src/routes/WarehousesRoute");
const infoRoute = require("./src/routes/InfoRoute");
//ERROR HANDLER IMPORT
const errorHandler = require("./src/errors/ErrorsHandler");

//SETTING UP APP
const app = express();
app.use(helmet()); //Helps securing app
app.use(cors({ origin: CONFIG.ORIGIN }));
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
app.use("/requests", reqeustsRoute);
app.use("/vehicles", vehiclesRoute);
app.use("/reservations", reservationsRoute);
app.use("/dispatches", dispatchesRoute);
app.use("/distributor", distributorRoute);
app.use("/warehouses", warehousesRoute);
app.use("/info", infoRoute);

//USING ERROR HANDLER
app.use(errorHandler);

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
