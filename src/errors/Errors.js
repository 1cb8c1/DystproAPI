//CODES THAT ARE RETURNED IN HTTPS RESPONSE
const CODES = {
  BADARGUMENT: "BADARGUMENT",
  DATABASE: "DATABASE",
  LOGIC: "LOGIC",
  NOTAUTHORIZED: "NOTAUTHORIZED",
  REJECTED: "REJECTED",
};

const DATABASE_ERRORS = {
  50001: {
    MESSAGE: "Driver doesn't exist",
    DEVELOPER_INFO:
      "User tried to modify driver that doesn't exist or is out of scope of his distributor (belongs to different distributor)",
  },
  50000: {
    MESSAGE: "Driver doesn't exist",
    DEVELOPER_INFO:
      "User tried to delete driver that doesn't exist or is out of scope of his distributor (belongs to different distributor)",
  },
};

//EXPORTS
module.exports = {
  CODES,
  DATABASE_ERRORS,
};
