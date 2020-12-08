/* eslint-disable no-undef */
jest.setTimeout(10000);
const { getApp, shutDown } = require("../server");
const {
  addDriver,
  removeDriver,
  modifyDriver,
  getDriver,
} = require("../db/drivers");

//REGISTER
describe("DB drviers", () => {
  it("should add and remove driver", async (done) => {
    const distributorId = 1;

    await getApp();
    const result = await addDriver("Jacek", "Driver", distributorId);
    expect(result).not.toBe(null);

    const result2 = await getDriver(result.driver_id, distributorId);
    expect(result2).toStrictEqual({
      driver_id: result.driver_id,
      name: "Jacek",
      surname: "Driver",
    });

    await removeDriver(result.driver_id, distributorId);

    const result3 = await getDriver(result.driver_id, distributorId);
    expect(result3).toBe(undefined);

    done();
  });

  it("should fail to remove the driver", async () => {
    await getApp();

    return expect(removeDriver(1, 10000)).rejects.toThrow(
      "Trying to delete driver that doesnt exist for this distributor"
    );
  });

  it("should add, modify only name and remove driver", async (done) => {
    const distributorId = 1;

    await getApp();
    const result = await addDriver("Benek", "Drer", distributorId);
    expect(result).not.toBe(null);

    const result2 = await getDriver(result.driver_id, distributorId);
    expect(result2).toStrictEqual({
      driver_id: result.driver_id,
      name: "Benek",
      surname: "Drer",
    });

    await modifyDriver(result.driver_id, "Wenek", null, distributorId);

    const result3 = await getDriver(result.driver_id, distributorId);

    expect(result3).toStrictEqual({
      driver_id: result.driver_id,
      name: "Wenek",
      surname: "Drer",
    });

    await removeDriver(result.driver_id, distributorId);

    const result4 = await getDriver(result.driver_id);
    expect(result4).toBe(undefined);

    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
