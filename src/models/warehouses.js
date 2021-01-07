//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
const createWarehouse = async (name, city, street) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.NVarChar(32), name);
  request.input("city", sql.NVarChar(32), city);
  request.input("street", sql.NVarChar(32), street);
  await request.execute("dbo.create_warehouse");
  return { name: name, city: city, street: street };
};

const reopenWarehouse = async (name) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.NVarChar(32), name);
  await request.execute("dbo.reopen_warehouse");
  return await getWarehouseByName(name);
};

const deleteWarehouse = async (name) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.NVarChar(32), name);
  await request.execute("dbo.delete_warehouse");
  return;
};

const getAllWarehouses = async () => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  const result = await request.query("SELECT * FROM dbo.get_all_warehouses()");
  return result.recordset;
};

const getWarehouseByName = async (name) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.NVarChar(32), name);
  const result = await request.query(
    "SELECT * FROM dbo.get_warehouse_by_name(@name)"
  );
  return result.recordset[0];
};

//EXPORTS
module.exports = {
  createWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  getWarehouseByName,
  reopenWarehouse,
};
