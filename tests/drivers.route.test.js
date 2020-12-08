/* eslint-disable no-undef */
jest.setTimeout(10000);
const { getApp, shutDown } = require("../server");
const { removeDriver, getDriver } = require("../db/drivers");
const request = require("supertest");

describe("Drivers endpoints", () => {
  it("tests post endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const driver = {
      name: "Rajek",
      surname: "Wajeckiy",
    };

    const result2 = await request(app)
      .post("/drivers")
      .set("x-access-token", result.body.token)
      .send({ driver: driver });

    expect(result2.body).toStrictEqual({
      driver: {
        driver_id: result2.body.driver.driver_id,
        ...driver,
      },
    });

    await removeDriver(result2.body.driver.driver_id, distributorId);
  });

  it("tests patch endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const driver = {
      name: "Rajek",
      surname: "Wajeckiy",
    };

    const result2 = await request(app)
      .post("/drivers")
      .set("x-access-token", result.body.token)
      .send({ driver: driver });

    expect(result2.body).toStrictEqual({
      driver: {
        driver_id: result2.body.driver.driver_id,
        ...driver,
      },
    });

    const result3 = await request(app)
      .patch(`/drivers/${result2.body.driver.driver_id}`)
      .set("x-access-token", result.body.token)
      .send({
        driver: {
          name: "Rajekzmieniony",
        },
      });

    expect(result3.body).toStrictEqual({
      driver: {
        driver_id: result2.body.driver.driver_id,
        name: "Rajekzmieniony",
        surname: result2.body.driver.surname,
      },
    });

    await removeDriver(result2.body.driver.driver_id, distributorId);
  });

  it("tests delete endpoint", async () => {
    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    const driver = {
      name: "Rajek",
      surname: "Wajeckiy",
    };

    const result2 = await request(app)
      .post("/drivers")
      .set("x-access-token", result.body.token)
      .send({ driver: driver });

    expect(result2.body).toStrictEqual({
      driver: {
        driver_id: result2.body.driver.driver_id,
        ...driver,
      },
    });

    const result3 = await request(app)
      .delete(`/drivers/${result2.body.driver.driver_id}`)
      .set("x-access-token", result.body.token)
      .send({});
    expect(result3.status).toBe(200);

    const result4 = await getDriver(result2.body.driver.driver_id);
    expect(result4).toBe(undefined);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
