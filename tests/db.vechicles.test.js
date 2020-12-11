/* eslint-disable no-undef */
jest.setTimeout(10000);
const { getApp, shutDown } = require("../server");
const DBvechicles = require("../src/models/vechicles");

//REGISTER
describe("DB vechicles", () => {
  it("should add, get and remove vechicle", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvechicles.addVechicle("TEST123", distributorId);

    const result2 = await DBvechicles.getVechicle(
      result.vechicle_id,
      distributorId
    );
    expect(result2.vechicle_id).toBe(result.vechicle_id);
    expect(result2.registration_number).toBe("TEST123");

    await DBvechicles.removeVechicle(result.vechicle_id, distributorId);

    const result3 = await DBvechicles.getVechicle(
      result.vechicle_id,
      distributorId
    );
    expect(result3).toBe(undefined);
  });

  it("should get 3 vechicles", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvechicles.addVechicle("TEST124", distributorId);
    const result2 = await DBvechicles.addVechicle("TEST125", distributorId);
    const result3 = await DBvechicles.addVechicle("TEST126", distributorId);

    const result4 = await DBvechicles.getVechicles(distributorId);

    expect(result4.length).toBe(3);

    await DBvechicles.removeVechicle(result.vechicle_id, distributorId);
    await DBvechicles.removeVechicle(result2.vechicle_id, distributorId);
    await DBvechicles.removeVechicle(result3.vechicle_id, distributorId);

    const result5 = await DBvechicles.getVechicles(distributorId);

    expect(result5).toStrictEqual([]);
  });

  it("should throw error when adding two vechicles with same registration", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvechicles.addVechicle("TEST123", distributorId);

    let e = null;
    try {
      await DBvechicles.addVechicle("TEST123", distributorId);
    } catch (error) {
      e = error;
      expect(error.number).toBe(50004);
    } finally {
      await DBvechicles.removeVechicle(result.vechicle_id, distributorId);
      expect(e).not.toBe(null);
    }
  });

  it("should throw error when removing vechicle that doesn't exist", async () => {
    await getApp();
    const distributorId = 1;

    let e = null;
    try {
      await DBvechicles.removeVechicle(300, distributorId);
    } catch (error) {
      e = error;
      expect(error.number).toBe(50005);
    } finally {
      expect(e).not.toBe(null);
    }
  });

  it("should throw error when removing vechicle that belongs to other distributor", async () => {
    await getApp();
    const distributorId = 1;

    const result = await DBvechicles.addVechicle("TEST123", distributorId);

    const result2 = await DBvechicles.getVechicle(
      result.vechicle_id,
      distributorId
    );
    expect(result2.vechicle_id).toBe(result.vechicle_id);
    expect(result2.registration_number).toBe("TEST123");

    let e = null;
    try {
      await DBvechicles.removeVechicle(300, distributorId + 1);
    } catch (error) {
      e = error;
      expect(error.number).toBe(50005);
    } finally {
      expect(e).not.toBe(null);
    }

    await DBvechicles.removeVechicle(result.vechicle_id, distributorId);
    const result3 = await DBvechicles.getVechicle(
      result.vechicle_id,
      distributorId
    );
    expect(result3).toBe(undefined);
  });
});

afterAll(() => {
  shutDown();
});
