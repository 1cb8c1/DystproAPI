/* eslint-disable no-undef */
jest.setTimeout(10000);
const request = require("supertest");
const { getApp, shutDown } = require("../server");

//REGISTER
describe("Products endpoint", () => {
  it("should get list of products", async () => {
    const app = await getApp();
    const result = await request(app).post("/auth/login").send({
      email: "baba@piaskowa.pl",
      password: "123abc&&ABC",
    });

    const res = await request(app)
      .get("/products/")
      .set("x-access-token", result.body.token)
      .send({});
    const expectedResult = [
      { name: "Plytki wielkorzebne czarne", product_id: 1 },
      { name: "Plytki wielkorzebne niebieskie", product_id: 2 },
      { name: "Plytki wielkorzebne szarne", product_id: 3 },
    ];
    expect(res.statusCode).toBe(200);
    expect(res.body.products).toStrictEqual(expectedResult);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
