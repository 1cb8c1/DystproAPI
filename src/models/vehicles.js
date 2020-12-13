//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50004
const addVehicle = async (registrationNumber, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("registration_number", sql.VarChar(16), registrationNumber);
  request.input("distributor_id", sql.Int, distributorId);
  request.output("vehicle_id", sql.Int);
  const result = await request.execute("dbo.create_vehicle");
  return {
    vehicle_id: result.output.vehicle_id,
    registration_number: registrationNumber,
  };
};

//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50005
const removeVehicle = async (vehicleId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("vehicle_id", sql.Int, vehicleId);
  request.input("distributor_id", sql.Int, distributorId);
  await request.execute("dbo.remove_vehicle_by_id");
};

const getVehicles = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_vehicles_by_distributor_id(@distributor_id)"
  );
  return result.recordset;
};

const getVehicle = async (vehicleId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("vehicle_id", sql.Int, vehicleId);
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_vehicle_by_id(@vehicle_id,@distributor_id)"
  );
  return result.recordset[0];
};

//EXPORTS
module.exports = { addVehicle, removeVehicle, getVehicle, getVehicles };
