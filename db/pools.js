const { ConnectionPool } = require("mssql");
const POOLS = {};
const P_OWNER = "OWNER";

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

module.exports = {
  closePool,
  createPool,
  getPool,
  P_OWNER,
};

//Populating pools
createPool(process.env.SQLAZURECONNSTR_DYSTPROOWNER, P_OWNER);

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

//Closing pools on exit
//Better solution for these bad boys
process.on("exit", cleanUp);

process.on("SIGINT", () => {
  console.log("\nCaught SIGINT");
  process.exit();
});
