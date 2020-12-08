jest.setTimeout(10000);
const { getApp, listenHandler, shutDown } = require("../server");
const { getDrivers, addDriver, removeDriver } = require("../db/drivers");

//REGISTER
describe("DB drviers", () => {
  it("should add and remove driver", async (done) => {
    const distributorId = 1;

    await getApp();
    const result = await addDriver("Jacek", "Driver", distributorId);
    expect(result).not.toBe(null);

    const result2 = await getDrivers(1);
    expect(result2.length).toBe(1);

    await removeDriver(result.driver_id, distributorId);

    const result3 = await getDrivers(1);
    expect(result3.length).toBe(0);

    done();
  });

  it("should fail to remove the driver", async () => {
    await getApp();
    try {
      await removeDriver(1, 1000);
    } catch (err) {
      console.log(err);
    }

    return expect(removeDriver(1, 10000)).rejects.toThrow(
      "Trying to delete driver that doesnt exist for this distributor"
    );
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
