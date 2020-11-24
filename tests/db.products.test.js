jest.setTimeout(10000);
const { getApp, listenHandler } = require("../server");
const { getProductsNames } = require("../db/products");

describe("Products db", () => {
  it("should get products names", async (done) => {
    const app = await getApp();
    const result = await getProductsNames();
    const expectedResult = [
      { name: "3445330 Plytki wielkorzebne", product_id: 1 },
      { name: "3445331 Plytki welkobergowe", product_id: 2 },
      { name: "3445332 Plytki welkowykladowe", product_id: 3 },
    ];
    expect(result).toStrictEqual(expectedResult);
    done();
  });

  it("should get one product by filtering names", async (done) => {
    const app = await getApp();
    const result = await getProductsNames("rzebne");
    const expectedResult = [
      { name: "3445330 Plytki wielkorzebne", product_id: 1 },
    ];
    expect(result).toStrictEqual(expectedResult);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
