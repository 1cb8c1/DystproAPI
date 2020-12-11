//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50004
const addVechicle = async (registrationNumber, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("registration_number", sql.VarChar(16), registrationNumber);
  request.input("distributor_id", sql.Int, distributorId);
  request.output("vechicle_id", sql.Int);
  const result = await request.execute("dbo.create_vechicle");
  return {
    vechicle_id: result.output.vechicle_id,
    registration_number: registrationNumber,
  };
};

//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50005
const removeVechicle = async (vechicleId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("vechicle_id", sql.Int, vechicleId);
  request.input("distributor_id", sql.Int, distributorId);
  await request.execute("dbo.remove_vechicle_by_id");
};

const getVechicles = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_vechicles_by_distributor_id(@distributor_id)"
  );
  return result.recordset;
};

const getVechicle = async (vechicleId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("vechicle_id", sql.Int, vechicleId);
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_vechicle_by_id(@vechicle_id,@distributor_id)"
  );
  return result.recordset[0];
};

//EXPORTS
module.exports = { addVechicle, removeVechicle, getVechicle, getVechicles };
