/* eslint-disable no-undef */
jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const DBproducts = require("../src/models/products");
const DBreservations = require("../src/models/reservations");
const DBdispatches = require("../src/models/dispatches");
const DBdrivers = require("../src/models/drivers");
const DBvehicles = require("../src/models/vehicles");
const sql = require("mssql");

//REGISTER
describe("DB dispatches", () => {
  it("should succesfully create and cancel dispatch", async () => {
    await getApp();
    const distributorId = 1;
    const driver = await DBdrivers.addDriver("Jacek", "Kacek", distributorId);
    const vehicle = await DBvehicles.addVehicle("KER 3321", distributorId);

    const product = await DBproducts.getProductDetails(1);
    const productWarehouseId1 = product.availability[0].product_warehouse_id;
    const reservedAmount1 = 100;

    const product2 = await DBproducts.getProductDetails(2);
    const productWarehouseId2 = product2.availability[0].product_warehouse_id;
    const reservedAmount2 = 20;

    //RESERVING
    const reservation = await DBreservations.createReservation(
      distributorId,
      productWarehouseId1,
      reservedAmount1
    );

    const reservation2 = await DBreservations.createReservation(
      distributorId,
      productWarehouseId2,
      reservedAmount2
    );

    const reservations = [
      reservation.reservation_id,
      reservation2.reservation_id,
    ];

    //CREATING DISPATCH
    const dispatch = await DBdispatches.createDispatch(
      distributorId,
      driver.driver_id,
      vehicle.vehicle_id,
      null,
      reservations
    );

    //CANCELING DISPATCh
    await DBdispatches.cancelDispatch(distributorId, dispatch.dispatch_id);

    //CLEANING
    await DBdrivers.removeDriver(driver.driver_id, distributorId);
    await DBvehicles.removeVehicle(vehicle.vehicle_id, distributorId);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
