const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

const getDrivers = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.VarChar(64), distributorId);
  const result = await request.query(
    "SELECT * FROM get_drivers_by_distributor_id(@distributor_id)"
  );
  return result.recordset;
};

const addDriver = async (name, surname, distributorId) => {
  if (distributorId === null || distributorId === undefined) {
    throw Error(`Distributor is ${distributorId}`);
  }

  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.VarChar(32), name);
  request.input("surname", sql.VarChar(32), surname);
  request.input("distributor_id", sql.Int, distributorId);
  request.output("driver_id", sql.Int);

  const result = await request.execute("dbo.create_driver");
  return { driver_id: result.output.driver_id, name: name, surname: surname };
};

const removeDriver = async (driverId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("driver_id", sql.VarChar(32), driverId);
  await request.query("EXEC dbo.remove_driver_by_id @driver_id");
};

module.exports = {
  getDrivers,
  addDriver,
  removeDriver,
};
