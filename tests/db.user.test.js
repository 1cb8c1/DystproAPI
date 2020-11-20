jest.setTimeout(10000);
const { getApp, listenHandler } = require("../server");
const {
  userExists,
  createUser,
  getUser,
  userAuthorized,
} = require("../db/users");

describe("DB user functions", () => {
  it("getUser should succeed", async (done) => {
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

  it("userAuthorized should succeed", async (done) => {
    const app = await getApp();
    const result = await userAuthorized("0.0017@email.com", "ADMIN");
    expect(result).toBe(true);
    done();
  });

  it("userAuthorized should succeed", async (done) => {
    const app = await getApp();
    const result = await userAuthorized("0.0028@email.com", "ADMIN");
    expect(result).toBe(false);
    done();
  });
});

//Fix closing down during tests!
//Not it uses --forceExit
afterAll(() => {
  listenHandler.close();
});
