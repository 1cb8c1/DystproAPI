const request = require("supertest");
const { getApp } = require("../server");
jest.setTimeout(10000);

describe("Get endpoints", () => {
  it("shoud test that get / returns true", async (done) => {
    const app = await getApp();
    const res = await request(app).get("/").send({});
    expect(res.statusCode).toBe(200);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
