/* eslint-disable no-undef */
jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const DBproducts = require("../src/models/products");
const DBreservations = require("../src/models/reservations");
const DBdistributors = require("../src/models/distributors");
const sql = require("mssql");

//REGISTER
describe("DB products", () => {
  it("should succesfully reserve and cancel reservation", async () => {
    await getApp();
    const distributorId = 1;
    const product = await DBproducts.getProductDetails(1);
    const productWarehouseId = product.availability[0].product_warehouse_id;
    const orgAmount = product.availability[0].amount;
    const reservedAmount = 100;
    const discount = await DBdistributors.getDistributorDiscount(distributorId);

    //RESERVING
    const reservation = await DBreservations.createReservation(
      distributorId,
      productWarehouseId,
      reservedAmount
    );
    const totalPrice = reservation.price;

    const productAfterReservation = await DBproducts.getProductDetails(1);
    const amountAfterReservation =
      productAfterReservation.availability[0].amount;
    //CANCELING
    await DBreservations.cancelReservation(
      reservation.reservation_id,
      distributorId
    );
    const productAfterCancelation = await DBproducts.getProductDetails(1);
    const amountAfterCancelation =
      productAfterCancelation.availability[0].amount;

    expect(amountAfterCancelation).toBe(orgAmount);
    expect(amountAfterReservation).toBe(orgAmount - reservedAmount);
    expect(totalPrice).toBeCloseTo(
      product.price * reservedAmount -
        (product.price * reservedAmount * discount) / 100
    );
  });

  it("should fail to reserve product (exceeded amount)", async () => {
    await getApp();
    const distributorId = 1;
    const product = await DBproducts.getProductDetails(1);
    const productWarehouseId = product.availability[0].product_warehouse_id;
    const orgAmount = product.availability[0].amount;
    const reservedAmount = orgAmount + 100;

    //RESERVING
    let error = null;
    try {
      await DBreservations.createReservation(
        distributorId,
        productWarehouseId,
        reservedAmount
      );
    } catch (err) {
      error = err;
    }
    expect(error).not.toBe(null);
    expect(error).toBeInstanceOf(sql.RequestError);
    expect(error.code).toBe("EREQUEST");
    expect(error.number).toBe(50007);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
