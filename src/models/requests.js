//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS

//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50002
const createRequest = async (userId, info) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("user_id", sql.Int, userId);
  request.input("info", sql.VarChar(512), info);
  request.output("request_id", sql.Int);
  const result = await request.execute("dbo.create_request");
  return { request_id: result.output.request_id, info: info };
};

//ADDITIONALLY CAN THROW RequestError WITH number THAT IS 50003
const removeRequest = async (requestId, userId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("request_id", sql.Int, requestId);
  request.input("user_id", sql.Int, userId);
  await request.execute("dbo.remove_request_by_id");
};

const getRequests = async (userId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("user_id", sql.Int, userId);
  const result = await request.query(
    "SELECT * FROM dbo.get_requests_by_user_id(@user_id)"
  );
  return result.recordset;
};

//EXPORTS
module.exports = {
  createRequest,
  removeRequest,
  getRequests,
};
