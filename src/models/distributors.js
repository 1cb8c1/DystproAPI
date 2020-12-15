//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
const getDistributorDiscount = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT dbo.get_distributor_discount(@distributor_id) AS discount"
  );
  return result.recordset[0].discount;
};

//EXPORTS
module.exports = { getDistributorDiscount };
