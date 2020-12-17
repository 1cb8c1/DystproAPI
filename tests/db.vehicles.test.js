/* eslint-disable no-undef */
jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const DBvehicles = require("../src/models/vehicles");

//REGISTER
describe("DB vehicles", () => {
  it("should add, get and remove vehicle", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvehicles.addVehicle("TEST123", distributorId);

    const result2 = await DBvehicles.getVehicle(
      result.vehicle_id,
      distributorId
    );
    expect(result2.vehicle_id).toBe(result.vehicle_id);
    expect(result2.registration_number).toBe("TEST123");

    await DBvehicles.removeVehicle(result.vehicle_id, distributorId);

    const result3 = await DBvehicles.getVehicle(
      result.vehicle_id,
      distributorId
    );
    expect(result3).toBe(undefined);
  });

  it("should get 3 vehicles", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvehicles.addVehicle("TEST124", distributorId);
    const result2 = await DBvehicles.addVehicle("TEST125", distributorId);
    const result3 = await DBvehicles.addVehicle("TEST126", distributorId);

    const result4 = await DBvehicles.getVehicles(distributorId);

    expect(result4.length).toBe(3);

    await DBvehicles.removeVehicle(result.vehicle_id, distributorId);
    await DBvehicles.removeVehicle(result2.vehicle_id, distributorId);
    await DBvehicles.removeVehicle(result3.vehicle_id, distributorId);

    const result5 = await DBvehicles.getVehicles(distributorId);

    expect(result5).toStrictEqual([]);
  });

  it("should throw error when adding two vehicles with same registration", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvehicles.addVehicle("TEST123", distributorId);

    let e = null;
    try {
      await DBvehicles.addVehicle("TEST123", distributorId);
    } catch (error) {
      e = error;
      expect(error.number).toBe(50004);
    } finally {
      await DBvehicles.removeVehicle(result.vehicle_id, distributorId);
      expect(e).not.toBe(null);
    }
  });

  it("should throw error when removing vehicle that doesn't exist", async () => {
    await getApp();
    const distributorId = 1;

    let e = null;
    try {
      await DBvehicles.removeVehicle(300, distributorId);
    } catch (error) {
      e = error;
      expect(error.number).toBe(50005);
    } finally {
      expect(e).not.toBe(null);
    }
  });

  it("should throw error when removing vehicle that belongs to other distributor", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvehicles.addVehicle("TEST123", distributorId);

    const result2 = await DBvehicles.getVehicle(
      result.vehicle_id,
      distributorId
    );
    expect(result2.vehicle_id).toBe(result.vehicle_id);
    expect(result2.registration_number).toBe("TEST123");

    let e = null;
    try {
      await DBvehicles.removeVehicle(300, distributorId + 1);
    } catch (error) {
      e = error;
      expect(error.number).toBe(50005);
    } finally {
      expect(e).not.toBe(null);
    }

    await DBvehicles.removeVehicle(result.vehicle_id, distributorId);
    const result3 = await DBvehicles.getVehicle(
      result.vehicle_id,
      distributorId
    );
    expect(result3).toBe(undefined);
  });
});

afterAll(() => {
  shutDown();
});
