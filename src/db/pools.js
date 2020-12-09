//IMPORTS
const { ConnectionPool } = require("mssql");
const POOLS = {};
const P_OWNER = "OWNER";
const CONFIG = require("../../Config");

//FUNCTIONS
const createPool = (config, name) => {
  if (getPool(name)) {
    throw new Error("Pool with this name already exists");
  }
  POOLS[name] = new ConnectionPool(config);
  return POOLS[name].connect();
};

const closePool = (name) => {
  if (Object.prototype.hasOwnProperty.call(POOLS, name)) {
    const pool = POOLS[name];
    delete POOLS[name];
    return pool.close();
  }
};

const getPool = (name) => {
  if (Object.prototype.hasOwnProperty.call(POOLS, name)) {
    return POOLS[name];
  }
};

//Populating pools
const populatePoolsPromise = new Promise(async (resolve, reject) => {
  //Checks if object is empty
  try {
    if (Object.keys(POOLS).length === 0 && POOLS.constructor === Object) {
      await createPool(CONFIG.SQLAZURECONNSTR_DYSTPROOWNER, P_OWNER);
    }
    resolve();
  } catch (error) {
    reject(error);
  }
});

//CLOSING DOWN POOLS, USUALLY USED WHEN CLOSING DOWN APP
const cleanUp = () => {
  console.log("Closing pools");
  for (const [name, pool] of Object.entries(POOLS)) {
    console.log(`Closing ${name}...`);
    try {
      closePool(name);
    } catch (error) {
      console.error(` name: ${name},\n  value:${pool},\n  error:${error}`);
    }
  }
};

//EXPORTS
module.exports = {
  closePool,
  createPool,
  getPool,
  populatePoolsPromise,
  P_OWNER,
  cleanUp,
};
