const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

const userExists = async (email) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("input_parameter", sql.VarChar(64), email);
  const result = await request.query(
    "SELECT dbo.email_exists(@input_parameter) AS emailExists"
  );
  return result.recordset[0].emailExists;
};

module.exports = {
  userExists,
};
