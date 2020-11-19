const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const SALT = 8;

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
  /*HASH IS 60 characters long*/
  const hashedPassword = bcrypt.hashSync(plainPassword, SALT);
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  request.input("hashed", sql.VarChar(255), hashedPassword);
  await request.query("EXEC dbo.create_user @email, @hashed");
};

module.exports = {
  userExists,
  createUser,
};
