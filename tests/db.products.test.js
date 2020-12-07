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
          amount: 300,
          product_warehouse_id: 1,
          warehouse_name: "Lódz Baluty 1",
        },
        {
          amount: 100,
          product_warehouse_id: 2,
          warehouse_name: "Lódz Baluty 2",
        },
        {
          amount: 0,
          product_warehouse_id: 3,
          warehouse_name: "Lódz Baluty 3",
        },
      ],
      name: "Plytki wielkorzebne czarne",
      price: 3000,
      product_id: 1,
      unit_name: "m2",
      unit_number: 300,
      weight: 1500,
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
