const request = require("supertest");
const { getApp, listenHandler } = require("../server");
jest.setTimeout(10000);

describe("Get endpoints", () => {
  it("basic test on /", async (done) => {
    const app = await getApp();
    const res = await request(app).get("/").send({});
    expect(res.statusCode).toBe(200);
    done();
  });
});

describe("Register user endpoints", () => {
  const email = `${Math.random().toString().substr(0, 4)}@email.com`;
  it("should register user", async (done) => {
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);
    done();
  });
  it("should fail when registering user (same email)", async (done) => {
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(500);
    done();
  });
  it("should fail when registering user (wrong email)", async (done) => {
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: "addllas",
      password: `123456`,
    });
    expect(res.statusCode).toBe(500);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
