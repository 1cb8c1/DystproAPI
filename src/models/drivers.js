//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
const getDrivers = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM get_drivers_by_distributor_id(@distributor_id)"
  );
  return result.recordset;
};

const addDriver = async (name, surname, distributorId) => {
  if (distributorId === undefined || distributorId === null) {
    throw Error(`Distributor is ${distributorId}`);
  }

  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.NVarChar(32), name);
  request.input("surname", sql.NVarChar(32), surname);
  request.input("distributor_id", sql.Int, distributorId);
  request.output("driver_id", sql.Int);

  const result = await request.execute("dbo.create_driver");
  return { driver_id: result.output.driver_id, name: name, surname: surname };
};

//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50000
const removeDriver = async (driverId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("driver_id", sql.Int, driverId);
  request.input("distributor_id", sql.Int, distributorId);
  await request.query(
    "EXEC dbo.remove_driver_by_id @driver_id, @distributor_id"
  );
};

//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50001
const modifyDriver = async (driverId, name, surname, distributorId) => {
  if (distributorId === undefined || distributorId === null) {
    throw Error(`Distributor is ${distributorId}`);
  }
  if (name === undefined || name === null || name.length === 0) {
    name = null;
  }
  if (surname === undefined || surname === null || surname.length === 0) {
    surname = null;
  }

  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("driver_id", sql.Int, driverId);
  request.input("name", sql.NVarChar(32), name);
  request.input("surname", sql.NVarChar(32), surname);
  request.input("distributor_id", sql.Int, distributorId);

  await request.execute("dbo.modify_driver");
};

const getDriver = async (driverId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("driver_id", sql.Int, driverId);
  request.input("distributor_id", sql.Int, distributorId);

  const result = await request.query(
    "SELECT * FROM get_driver_by_id(@driver_id,@distributor_id)"
  );
  return result.recordset[0];
};

//EXPORTS
module.exports = {
  getDrivers,
  addDriver,
  removeDriver,
  modifyDriver,
  getDriver,
};
