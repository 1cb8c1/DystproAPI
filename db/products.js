const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

const getProductsNames = async (orgName) => {
  let name = orgName;
  if (name === undefined) name = "";
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.VarChar(32), name);
  const result = await request.query(
    "SELECT * FROM dbo.get_products_names(@name)"
  );
  return result.recordset;
};

module.exports = {
  getProductsNames,
};
