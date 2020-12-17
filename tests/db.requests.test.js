/* eslint-disable no-undef */
jest.setTimeout(30000);
const { getApp, shutDown } = require("../server");
const {
  createRequest,
  removeRequest,
  getRequests,
} = require("../src/models/requests");

describe("DB requests", () => {
  it("should add, get and remove request", async () => {
    const userId = 1;

    await getApp();
    const result = await createRequest(userId, "Request test");
    expect(result.info).toBe("Request test");

    const result2 = await getRequests(userId);
    expect(result2.length).toBe(1);

    await removeRequest(result.request_id, userId);

    const result3 = await getRequests(userId);
    expect(result3.length).toBe(0);
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  shutDown();
});
