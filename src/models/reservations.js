//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
const createReservation = async (distributorId, productWarehouseId, amount) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  request.input("product_warehouse_id", sql.Int, productWarehouseId);
  request.input("amount", sql.Int, amount);
  request.output("reservation_id", sql.Int);
  const result = await request.execute("dbo.create_reservation");
  const reservationId = result.output.reservation_id;

  return await getReservationById(reservationId, distributorId);
};

const cancelReservation = async (reservationId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  request.input("reservation_id", sql.Int, reservationId);
  await request.execute("dbo.cancel_reservation");
  return;
};

const getReservationById = async (reservationId, distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("reservation_id", sql.Int, reservationId);
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_reservation_by_id(@reservation_id, @distributor_id)"
  );

  return result.recordset[0];
};

const getDistributorReservations = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_reservations_by_distributor_id(@distributor_id)"
  );

  return result.recordset;
};

//EXPORTS
module.exports = {
  createReservation,
  cancelReservation,
  getReservationById,
  getDistributorReservations,
};
