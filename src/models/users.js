//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");
const { generateHashedPassword } = require("../utils/auth/Password");

//FUNCTIONS
const emailExists = async (email) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  const result = await request.query(
    "SELECT dbo.email_exists(@email) AS emailExists"
  );
  return result.recordset[0].emailExists;
};

const userExists = async (id) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("id", sql.Int, id);
  const result = await request.query(
    "SELECT dbo.user_exists(@id) AS userExists"
  );
  return result.recordset[0].userExists;
};

const createUser = async (email, plainPassword) => {
  const hashedPassword = generateHashedPassword(plainPassword);
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  request.input("hashed", sql.VarChar(255), hashedPassword);
  await request.query("EXEC dbo.create_user @email, @hashed");
};

const getUserByEmail = async (email) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("email", sql.VarChar(64), email);
  const result = await request.query("SELECT * FROM get_user_by_email(@email)");
  return result.recordset[0];
};

const getUserByID = async (id) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("id", sql.Int, id);
  const result = await request.query("SELECT * FROM get_user_by_id(@id)");
  return result.recordset[0];
};

const userAuthorized = async (id, role) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("id", sql.Int, id);
  request.input("role", sql.VarChar(32), role);
  const result = await request.query(
    "SELECT dbo.user_authorized(@id, @role) AS authorized"
  );
  return result.recordset[0].authorized;
};

const removeUserById = async (id) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("id", sql.Int, id);
  await request.query("EXEC dbo.remove_user_procedure @id");
};

//EXPORTS
module.exports = {
  userExists,
  emailExists,
  createUser,
  getUserByEmail,
  getUserByID,
  userAuthorized,
  removeUserById,
};
