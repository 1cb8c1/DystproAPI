jest.setTimeout(10000);
const { getApp, listenHandler, shutDown } = require("../server");
const { getDrivers, addDriver, removeDriver } = require("../db/drivers");

//REGISTER
describe("DB drviers", () => {
  it("should add and remove driver", async (done) => {
    await getApp();
    const result = await addDriver("Jacek", "Driver", 1);
    expect(result).not.toBe(null);

    const result2 = await getDrivers(1);
    expect(result2.length).toBe(1);

    await removeDriver(result.driver_id);

    const result3 = await getDrivers(1);
    expect(result3.length).toBe(0);

    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
