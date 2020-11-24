jest.setTimeout(10000);
const request = require("supertest");
const { getApp, listenHandler } = require("../server");
const { getProductsNames } = require("../db/products");

//REGISTER
describe("Products endpoint", () => {
  it("should get list of products", async (done) => {
    const app = await getApp();
    const res = await request(app).get("/products/names").send({});
    const expectedResult = [
      { name: "3445330 Plytki wielkorzebne", product_id: 1 },
      { name: "3445331 Plytki welkobergowe", product_id: 2 },
      { name: "3445332 Plytki welkowykladowe", product_id: 3 },
    ];
    expect(res.statusCode).toBe(200);
    expect(res.body.products).toStrictEqual(expectedResult);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
