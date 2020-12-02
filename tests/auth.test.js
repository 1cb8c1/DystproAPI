jest.setTimeout(10000);
const { getApp, listenHandler, shutDown } = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const CONFIG = require("../Config");
const { removeUserById } = require("../db/users");

describe("Login endpoint", () => {
  it("Login should succeed", async (done) => {
    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toBe(200);
    expect(result.body.auth).toBe(true);

    done();
  });

  it("Login should fail - wrong password", async (done) => {
    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa*pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toBe(422);
    expect(result.body).toStrictEqual({
      auth: false,
      token: null,
      error: {
        code: "BADARGUMENT",
        message: "Wrong email or password",
      },
    });

    done();
  });

  it("Login should fail - wrong password", async (done) => {
    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABc",
    });
    expect(result.status).toBe(422);
    expect(result.body).toStrictEqual({
      auth: false,
      token: null,
      error: {
        code: "BADARGUMENT",
        message: "Wrong email or password",
      },
    });

    done();
  });
});

describe("Register endpoint", () => {
  it("Registration should succeed", async (done) => {
    const app = await getApp();
    const result = await request(app).post("/auth/register").send({
      email: "test@test.test",
      password: "test123!ABC",
    });
    expect(result.status).toBe(200);
    expect(result.body.auth).toBe(true);

    //Should succeed acccessing /me
    const result2 = await request(app)
      .get("/auth/me")
      .set("x-access-token", result.body.token)
      .send({});

    expect(result2.status).toBe(200);
    removeUserById(result2.body.user.user_id);

    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
