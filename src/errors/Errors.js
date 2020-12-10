//CODES THAT ARE RETURNED IN HTTPS RESPONSE
const CODES = {
  BADARGUMENT: "BADARGUMENT",
  DATABASE: "DATABASE",
  LOGIC: "LOGIC",
  NOTAUTHORIZED: "NOTAUTHORIZED",
  REJECTED: "REJECTED",
};

const DATABASE_ERRORS = {
  50000: {
    MESSAGE: "Driver doesn't exist",
    DEVELOPER_INFO:
      "User tried to delete driver that doesn't exist or is out of scope of his distributor (belongs to different distributor)",
  },
  50001: {
    MESSAGE: "Driver doesn't exist",
    DEVELOPER_INFO:
      "User tried to modify driver that doesn't exist or is out of scope of his distributor (belongs to different distributor)",
  },
  50002: {
    MESSAGE: "Too many requests",
    DEVELOPER_INFO: "User exceeded number of requests",
  },
  50003: {
    MESSAGE: "Request doesn't exist",
    DEVELOPER_INFO:
      "User tried to delete request that doesn't exist or is outside of his scope",
  },
};

//EXPORTS
module.exports = {
  CODES,
  DATABASE_ERRORS,
};
