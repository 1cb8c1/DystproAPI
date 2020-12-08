//IMPORTS
const { getPool, P_OWNER } = require("../db/pools");
const sql = require("mssql");

//FUNCTIONS
const getProductsNames = async (orgName) => {
  let name = orgName;
  if (name === undefined) name = "";
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("name", sql.VarChar(32), name);
  const result = await request.query(
    "SELECT * FROM dbo.get_products_names(@name)"
  );
  return result.recordset;
};

const getProductDetails = async (productId) => {
  const pool = getPool(P_OWNER);
  const request = pool.request();
  request.input("id", sql.Int, productId);
  const resultProduct = await request.query(
    "SELECT * FROM dbo.get_product(@id)"
  );
  const resultAvailability = await request.query(
    "SELECT * FROM dbo.get_product_availability(@id)"
  );

  const product = {
    ...resultProduct.recordset[0],
    availability: resultAvailability.recordset,
  };

  return product;
};

//EXPORTS
module.exports = {
  getProductsNames,
  getProductDetails,
};
