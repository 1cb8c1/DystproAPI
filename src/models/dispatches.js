//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");
const { getVehicle } = require("./vehicles");
const { getDriver } = require("./drivers");

//FUNCTIONS
const createDispatch = async (
  distributorId,
  driverId,
  vehicleId,
  pickupPlannedDateOrg,
  reservationsIds
) => {
  const pool = getPool(P_OWNER);

  let pickupPlannedDate = pickupPlannedDateOrg;
  if (pickupPlannedDate === undefined) {
    pickupPlannedDate = null;
  }

  const transaction = new sql.Transaction(pool);
  await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

  const requestCreateDispatch = new sql.Request(transaction);
  requestCreateDispatch.input("distributor_id", sql.Int, distributorId);
  requestCreateDispatch.input("driver_id", sql.Int, driverId);
  requestCreateDispatch.input("vehicle_id", sql.Int, vehicleId);
  requestCreateDispatch.input(
    "pickup_planned_date",
    sql.DateTime,
    pickupPlannedDate
  );
  requestCreateDispatch.output("dispatch_id", sql.Int);
  const result = await requestCreateDispatch.execute("dbo.create_dispatch");
  const dispatchId = result.output.dispatch_id;

  for (let reservationId of reservationsIds) {
    const requestCreateDispatchedProduct = new sql.Request(transaction);
    requestCreateDispatchedProduct.input(
      "distributor_id",
      sql.Int,
      distributorId
    );
    requestCreateDispatchedProduct.input("dispatch_id", sql.Int, dispatchId);
    requestCreateDispatchedProduct.input(
      "reservation_id",
      sql.Int,
      reservationId
    );
    requestCreateDispatchedProduct.output("dispatched_product_id", sql.Int);
    await requestCreateDispatchedProduct.execute(
      "dbo.create_dispatched_product"
    );
  }

  const requestFinishCreateDispatch = new sql.Request(transaction);
  requestFinishCreateDispatch.input("distributor_id", sql.Int, distributorId);
  requestFinishCreateDispatch.input("dispatch_id", sql.Int, dispatchId);
  await requestFinishCreateDispatch.execute("dbo.finish_create_dispatch");

  await transaction.commit();

  return await getDispatch(distributorId, dispatchId);

  /*Return dispatch*/
};

const cancelDispatch = async (distributorId, dispatchId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  request.input("dispatch_id", sql.Int, dispatchId);
  await request.execute("dbo.cancel_dispatch");
};

const getDispatches = async (distributorId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("distributor_id", sql.Int, distributorId);
  const result = await request.query(
    "SELECT * FROM dbo.get_dispatches_by_distributor_id(@distributor_id)"
  );
  return result.recordset;
};

const getDispatch = async (distributorId, dispatchId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();

  request.input("distributor_id", sql.Int, distributorId);
  request.input("dispatch_id", sql.Int, dispatchId);
  const dispatchQuery = await request.query(
    "SELECT * FROM dbo.get_dispatch(@distributor_id, @dispatch_id)"
  );
  const dispatch = dispatchQuery.recordset[0];

  const statesQuery = await request.query(
    "SELECT * FROM dbo.get_dispatch_states(@distributor_id, @dispatch_id)"
  );
  const states = statesQuery.recordset;

  const dispatchedProductsQuery = await request.query(
    "SELECT * FROM dbo.get_dispatched_products(@distributor_id, @dispatch_id)"
  );
  const dispatchedProducts = dispatchedProductsQuery.recordset;

  return {
    dispatch_id: dispatch.dispatch_id,
    pickup_planned_date: dispatch.pickup_planned_date,
    driver: {
      driver_id: dispatch.driver_id,
      name: dispatch.name,
      surname: dispatch.surname,
    },
    vehicle: {
      vehicle_id: dispatch.vehicle_id,
      registration_number: dispatch.registration_number,
    },
    warehouse_name: dispatch.warehouse_name,
    states: states,
    dispatched_products: dispatchedProducts,
  };
};

//EXPORTS
module.exports = {
  createDispatch,
  cancelDispatch,
  getDispatches,
  getDispatch,
};
