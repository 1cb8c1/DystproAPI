/* eslint-disable no-undef */
jest.setTimeout(10000);
const { getApp, shutDown } = require("../server");
const DBvechicles = require("../src/models/vechicles");
const request = require("supertest");
const { default: expectCt } = require("helmet/dist/middlewares/expect-ct");

describe("Vechicles endpoints", () => {
  it("tests post endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const vechicle = {
      registration_number: "Test123",
    };

    const result2 = await request(app)
      .post("/vechicles")
      .set("x-access-token", result.body.token)
      .send({ vechicle: vechicle });

    expect(result2.status).toBe(200);
    expect(result2.body.vechicle.registration_number).toBe(
      vechicle.registration_number
    );

    await DBvechicles.removeVechicle(
      result2.body.vechicle.vechicle_id,
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

    const result2 = await DBvechicles.addVechicle("Test123", distributorId);

    const result3 = await request(app)
      .delete(`/vechicles/${result2.vechicle_id}`)
      .set("x-access-token", result.body.token)
      .send({});

    expect(result3.status).toBe(200);

    const result4 = await DBvechicles.getVechicle(
      result2.vechicle_id,
      distributorId
    );
    expect(result4).toBe(undefined);
  });

  it("tests get vechicles endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const result2 = await DBvechicles.addVechicle("TEST123", distributorId);
    const result3 = await DBvechicles.addVechicle("TEST124", distributorId);
    const result4 = await DBvechicles.addVechicle("TEST125", distributorId);

    const result5 = await request(app)
      .get("/vechicles")
      .set("x-access-token", result.body.token)
      .send({});

    expect(result5.status).toBe(200);
    expect(result5.body.vechicles.length).toBe(3);

    await DBvechicles.removeVechicle(result2.vechicle_id, distributorId);
    await DBvechicles.removeVechicle(result3.vechicle_id, distributorId);
    await DBvechicles.removeVechicle(result4.vechicle_id, distributorId);
  });

  it("tests get vechicle endpoint", async () => {
    const distributorId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const result2 = await DBvechicles.addVechicle("TEST123", distributorId);

    const result3 = await request(app)
      .get(`/vechicles/${result2.vechicle_id}`)
      .set("x-access-token", result.body.token)
      .send({});

    await DBvechicles.removeVechicle(result2.vechicle_id, distributorId);

    expect(result3.status).toBe(200);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
