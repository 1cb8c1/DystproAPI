const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");
const { generateHashedPassword } = require("../auth/Password");

const userExists = async (email) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  const result = await request.query(
    "SELECT dbo.email_exists(@email) AS emailExists"
  );
  return result.recordset[0].emailExists;
};

const createUser = async (email, plainPassword) => {
  const hashedPassword = generateHashedPassword(plainPassword);
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  request.input("hashed", sql.VarChar(255), hashedPassword);
  await request.query("EXEC dbo.create_user @email, @hashed");
};

const getUser = async (email) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  const result = await request.query("SELECT * FROM get_user(@email)");
  return result.recordset[0];
};

const userAuthorized = async (email, role) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  request.input("role", sql.VarChar(32), role);
  const result = await request.query(
    "SELECT dbo.user_authorized(@email, @role) AS authorized"
  );
  return result.recordset[0].authorized;
};

module.exports = {
  userExists,
  createUser,
  getUser,
  userAuthorized,
};
