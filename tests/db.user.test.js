/* eslint-disable no-undef */
jest.setTimeout(10000);
const { getApp, shutDown } = require("../server");
const {
  userExists,
  getUserByEmail,
  getUserByID,
  emailExists,
} = require("../db/users");

describe("DB get user functions", () => {
  it("getUserById should succeed", async () => {
    await getApp();
    const result = await getUserByID("1");
    const expected = {
      distributor: 1,
      email: "baba@piaskowa.pl",
      password: "$2a$14$hB8NZ3Nu0lhZGXoRPXmGDeg3O2KGtv/L2KYfWo70OssgQNkbY7kNe",
      password_creation_date: new Date("2020-11-30T20:15:21.377Z"),
      user_id: 1,
    };
    expect(result).toStrictEqual(expected);
  });
  it("getUserByEmail should succeed", async () => {
    await getApp();
    const result = await getUserByEmail("baba@piaskowa.pl");
    const expected = {
      distributor: 1,
      email: "baba@piaskowa.pl",
      password: "$2a$14$hB8NZ3Nu0lhZGXoRPXmGDeg3O2KGtv/L2KYfWo70OssgQNkbY7kNe",
      password_creation_date: new Date("2020-11-30T20:15:21.377Z"),
      user_id: 1,
    };
    expect(result).toStrictEqual(expected);
  });
});

describe("DB exists functions for user", () => {
  it("user should exist", async () => {
    await getApp();
    const result = await userExists(1);
    const expected = true;
    expect(result).toBe(expected);
  });

  it("user shouldn't exist", async () => {
    await getApp();
    const result = await userExists(1000);
    const expected = false;
    expect(result).toBe(expected);
  });

  it("email should exist", async () => {
    await getApp();
    const result = await emailExists("baba@piaskowa.pl");
    const expected = true;
    expect(result).toBe(expected);
  });

  it("email shouldn't exist", async () => {
    await getApp();
    const result = await emailExists("baba..............piaskowa.pl");
    const expected = false;
    expect(result).toBe(expected);
  });
});

describe("DB should return undefined", () => {
  it("user should exist", async () => {
    await getApp();
    const result = await getUserByID(1320001);
    const expected = undefined;
    expect(result).toStrictEqual(expected);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
