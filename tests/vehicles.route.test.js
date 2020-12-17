/* eslint-disable no-undef */
jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const DBvehicles = require("../src/models/vehicles");
const request = require("supertest");
const { default: expectCt } = require("helmet/dist/middlewares/expect-ct");

describe("Vehicles endpoints", () => {
  it("tests post endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const vehicle = {
      registration_number: "Test123",
    };

    const result2 = await request(app)
      .post("/vehicles")
      .set("x-access-token", result.body.token)
      .send({ vehicle: vehicle });

    expect(result2.status).toBe(200);
    expect(result2.body.vehicle.registration_number).toBe(
      vehicle.registration_number
    );

    await DBvehicles.removeVehicle(
      result2.body.vehicle.vehicle_id,
      distributorId
    );
  });

  it("tests delete endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const result2 = await DBvehicles.addVehicle("Test123", distributorId);

    const result3 = await request(app)
      .delete(`/vehicles/${result2.vehicle_id}`)
      .set("x-access-token", result.body.token)
      .send({});

    expect(result3.status).toBe(200);

    const result4 = await DBvehicles.getVehicle(
      result2.vehicle_id,
      distributorId
    );
    expect(result4).toBe(undefined);
  });

  it("tests get vehicles endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const result2 = await DBvehicles.addVehicle("TEST123", distributorId);
    const result3 = await DBvehicles.addVehicle("TEST124", distributorId);
    const result4 = await DBvehicles.addVehicle("TEST125", distributorId);

    const result5 = await request(app)
      .get("/vehicles")
      .set("x-access-token", result.body.token)
      .send({});

    expect(result5.status).toBe(200);
    expect(result5.body.vehicles.length).toBe(3);

    await DBvehicles.removeVehicle(result2.vehicle_id, distributorId);
    await DBvehicles.removeVehicle(result3.vehicle_id, distributorId);
    await DBvehicles.removeVehicle(result4.vehicle_id, distributorId);
  });

  it("tests get vehicle endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const result2 = await DBvehicles.addVehicle("TEST123", distributorId);

    const result3 = await request(app)
      .get(`/vehicles/${result2.vehicle_id}`)
      .set("x-access-token", result.body.token)
      .send({});

    await DBvehicles.removeVehicle(result2.vehicle_id, distributorId);

    expect(result3.status).toBe(200);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
