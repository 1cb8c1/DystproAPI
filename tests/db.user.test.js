jest.setTimeout(10000);
const { getApp, listenHandler } = require("../server");
const { userExists, createUser, getUser } = require("../db/users");

describe("Get endpoints", () => {
  it("basic test on /", async (done) => {
    const app = await getApp();
    const result = await getUser("baba@piaskowa.pl");
    const expected = {
      email: "baba@piaskowa.pl",
      password: "111mojehaslo",
    };
    expect(result.email).toBe(expected.email);
    expect(result.password).toBe(result.password);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
