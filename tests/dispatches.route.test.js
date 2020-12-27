jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const request = require("supertest");
const DBproducts = require("../src/models/products");
const DBreservations = require("../src/models/reservations");
const DBdispatches = require("../src/models/dispatches");
const DBdrivers = require("../src/models/drivers");
const DBvehicles = require("../src/models/vehicles");
const sql = require("mssql");

describe("Dispatches Post endpoint", () => {
  it("Post should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

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
    const dispatchPostResponse = await request(app)
      .post("/dispatches")
      .set("x-access-token", responseWithToken.body.token)
      .send({
        dispatch: {
          driver_id: driver.driver_id,
          vehicle_id: vehicle.vehicle_id,
          reservations_ids: reservations,
        },
      });

    //CANCELING DISPATCh
    await DBdispatches.cancelDispatch(
      distributorId,
      dispatchPostResponse.body.dispatch.dispatch_id
    );

    //CLEANING
    await DBdrivers.removeDriver(driver.driver_id, distributorId);
    await DBvehicles.removeVehicle(vehicle.vehicle_id, distributorId);

    //EXPECTS
    expect(dispatchPostResponse.status).toBe(200);
  });
});

describe("Dispatches Get endpoint", () => {
  it("Get with id should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

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

    //GETTING dispatch
    const dispatchGetResponse = await request(app)
      .get(`/dispatches/${dispatch.dispatch_id}`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    //CANCELING DISPATCh
    await DBdispatches.cancelDispatch(distributorId, dispatch.dispatch_id);

    //CLEANING
    await DBdrivers.removeDriver(driver.driver_id, distributorId);
    await DBvehicles.removeVehicle(vehicle.vehicle_id, distributorId);

    //EXPECTS
    expect(dispatchGetResponse.status).toBe(200);
  });

  it("Get should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

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

    //GETTING dispatch
    const dispatchesGetResponse = await request(app)
      .get(`/dispatches/`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    //CANCELING DISPATCh
    await DBdispatches.cancelDispatch(distributorId, dispatch.dispatch_id);

    //CLEANING
    await DBdrivers.removeDriver(driver.driver_id, distributorId);
    await DBvehicles.removeVehicle(vehicle.vehicle_id, distributorId);

    //EXPECTS
    expect(dispatchesGetResponse.status).toBe(200);
  });
});

describe("Dispatches Delete endpoint", () => {
  it("Delete should succeed", async () => {
    const app = await getApp();
    const distributorId = 1;

    const responseWithToken = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(responseWithToken.status).toBe(200);
    expect(responseWithToken.body.auth).toBe(true);

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

    //CANCELING DISPATCH
    const dispatchDeleteResponse = await request(app)
      .delete(`/dispatches/${dispatch.dispatch_id}`)
      .set("x-access-token", responseWithToken.body.token)
      .send({});

    //CLEANING
    await DBdrivers.removeDriver(driver.driver_id, distributorId);
    await DBvehicles.removeVehicle(vehicle.vehicle_id, distributorId);

    //EXPECTS
    expect(dispatchDeleteResponse.status).toBe(200);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
