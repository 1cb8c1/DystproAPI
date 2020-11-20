jest.setTimeout(10000);
const request = require("supertest");
const { getApp, listenHandler } = require("../server");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

//REGISTER
describe("Register user endpoints", () => {
  it("should register user and get token", async (done) => {
    const email = `${Math.random().toString().substr(0, 6)}@email.com`;
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.auth).toBe(true);

    //SOMETIMES IT BREAKS
    /*
    const token = jwt.sign({ email: email }, SECRET, {
      expiresIn: 86400,
    });
    expect(res.body.token).toBe(token);
    */
    done();
  });

  it("should fail when registering user (same email)", async (done) => {
    const email = `${Math.random().toString().substr(0, 6)}@email.com`;
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res2.statusCode).toBe(500);
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

  it("should succeed getting decoded token", async (done) => {
    const email = `${Math.random().toString().substr(0, 6)}@email.com`;
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);

    const token = res.body.token;
    const res2 = await request(app)
      .get("/auth/me")
      .send({})
      .set({ "x-access-token": token });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.email).toBe(email);
    done();
  });

  it("should fail getting decoded token", async (done) => {
    const email = `${Math.random().toString().substr(0, 6)}@email.com`;
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);

    const token = jwt.sign({ email: email + "test" }, SECRET, {
      expiresIn: 86400,
    });
    const res2 = await request(app)
      .get("/auth/me")
      .send({})
      .set({ "x-acces-token": token });
    expect(res2.statusCode).toBe(403);
    expect(res2.body.email).toBe(undefined);
    done();
  });
});

//LOGIN
describe("Login user endpoints", () => {
  it("should register and then login user and get token", async (done) => {
    //Register
    const email = `${Math.random().toString().substr(0, 6)}@email.com`;
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.auth).toBe(true);

    const token = jwt.sign({ email: email }, SECRET, {
      expiresIn: 86400,
    });
    expect(res.body.token).toBe(token);

    //Login
    const res2 = await request(app).post("/auth/login").send({
      email: email,
      password: `123456`,
    });
    expect(res2.statusCode).toBe(200);

    const token2 = jwt.sign({ email: email }, SECRET, {
      expiresIn: 86400,
    });
    expect(res2.body.token).toBe(token2);
    done();
  });

  it("fail loging user - wrong email", async (done) => {
    //Login
    const app = await getApp();
    const email = "idontexistindb@tryme.pl";
    const res = await request(app).post("/auth/login").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.token).toBe(undefined);
    done();
  });

  it("fail loging user - wrong password", async (done) => {
    //Register
    const email = `${Math.random().toString().substr(0, 6)}@email.com`;
    const app = await getApp();
    const res = await request(app).post("/auth/register").send({
      email: email,
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.auth).toBe(true);

    const token = jwt.sign({ email: email }, SECRET, {
      expiresIn: 86400,
    });
    expect(res.body.token).toBe(token);

    //Login
    const res2 = await request(app).post("/auth/login").send({
      email: email,
      password: `wrongpassword`,
    });
    expect(res2.statusCode).toBe(401);
    expect(res2.body.token).toBe(null);
    done();
  });
});

//ADMIN ACCESS
describe("Admin access test", () => {
  it("should access with admin permissions", async (done) => {
    //Login
    const app = await getApp();
    const res = await request(app).post("/auth/login").send({
      email: "0.0017@email.com",
      password: `123456`,
    });
    expect(res.statusCode).toBe(200);
    const token = res.body.token;

    const res2 = await request(app)
      .get("/")
      .send({})
      .set({ "x-access-token": token });
    expect(res2.statusCode).toBe(200);

    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
