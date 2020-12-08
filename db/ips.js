const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");
const ips = require("../networking/Ips");

const insertFailedLogin = async (ip) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("ip", sql.VarChar(45), ips.removePort(ip));
  await request.query("EXEC dbo.insert_failed_login @ip");
};

const getBanishedIpsFromLogin = async () => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  const result = await request.query(
    "SELECT * FROM get_basnished_ips_from_login()"
  );
  //What if empty is returned
  return result.recordset.map((obj) => obj.ip);
};

module.exports = { insertFailedLogin, getBanishedIpsFromLogin };
