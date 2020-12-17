/* eslint-disable no-undef */
jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const DBdistributors = require("../src/models/distributors");

//REGISTER
describe("DB products", () => {
  it("should reserve and cancel reservation", async () => {
    await getApp();

    const distributorId = 1;
    const discount = await DBdistributors.getDistributorDiscount(distributorId);
    expect(discount).toBeCloseTo(5.0);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
