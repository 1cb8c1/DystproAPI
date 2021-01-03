jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const request = require("supertest");

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

    const discountRequest = await request(app)
      .get("/distributor/discount")
      .set("x-access-token", result.body.token)
      .send({});

    expect(discountRequest.status).toBe(200);
    expect(discountRequest.body.discount).toBe(5);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
