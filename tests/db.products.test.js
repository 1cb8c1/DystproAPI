jest.setTimeout(10000);
const { getApp, listenHandler, shutDown } = require("../server");
const { getProductDetails } = require("../db/products");

//REGISTER
describe("DB products", () => {
  it("should get details of a product", async (done) => {
    await getApp();
    const res = await getProductDetails(1);
    const expectedResult = {
      availability: [
        {
          amount: 8000,
          product_warehouse_id: 1,
          warehouse_name: "Lódz Baluty 1",
        },
        {
          amount: 16000,
          product_warehouse_id: 2,
          warehouse_name: "Lódz Baluty 2",
        },
      ],
      name: "3445330 Plytki wielkorzebne",
      price: 10000,
      product_id: 1,
      unit_name: "szt.",
      unit_number: 4000,
      weight: 500,
    };
    expect(res).toStrictEqual(expectedResult);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
