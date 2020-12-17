jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const request = require("supertest");
const { removeRequest } = require("../src/models/requests");

describe("Post request endpoint", () => {
  it("Posting should succeed", async () => {
    const userId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toBe(200);
    expect(result.body.auth).toBe(true);

    const result2 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing" });

    expect(result2.status).toBe(200);
    expect(result2.body.request.info).toBe("testing");

    await removeRequest(result2.body.request.request_id, userId);
  });

  it("Posting should fail, info too short", async () => {
    const userId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toBe(200);
    expect(result.body.auth).toBe(true);

    const result2 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "" });

    expect(result2.status).toBe(422);
  });

  it("Posting should fail, info too long", async () => {
    const userId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toBe(200);
    expect(result.body.auth).toBe(true);

    const result2 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "A".repeat(512) + "B" });

    expect(result2.status).toBe(422);
  });

  it("Posting should fail - too many requests (more than 5)", async () => {
    const userId = 1;

    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });
    expect(result.status).toBe(200);
    expect(result.body.auth).toBe(true);

    const result2 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing1" });
    const result3 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing2" });
    const result4 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing3" });
    const result5 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing4" });
    const result6 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing5" });

    const result7 = await request(app)
      .post("/requests")
      .set("x-access-token", result.body.token)
      .send({ info: "testing6" });

    expect(result7.status).toBe(409);

    await removeRequest(result2.body.request.request_id, userId);
    await removeRequest(result3.body.request.request_id, userId);
    await removeRequest(result4.body.request.request_id, userId);
    await removeRequest(result5.body.request.request_id, userId);
    await removeRequest(result6.body.request.request_id, userId);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
