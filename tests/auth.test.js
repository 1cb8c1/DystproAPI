jest.setTimeout(10000);
const { getApp, listenHandler } = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const CONFIG = require("../Config");

describe("DB get user functions", () => {
  it("Login should succeed", async (done) => {
    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toStrictEqual(200);
    expect(result.body.auth).toBe(true);

    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
