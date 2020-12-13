//CODES THAT ARE RETURNED IN HTTPS RESPONSE
const CODES = {
  BADARGUMENT: "BADARGUMENT",
  DATABASE: "DATABASE",
  LOGIC: "LOGIC",
  NOTAUTHORIZED: "NOTAUTHORIZED",
  REJECTED: "REJECTED",
  NOTFOUND: "NOT FOUND",
};

const DATABASE_ERRORS = {
  50000: {
    MESSAGE: "Driver doesn't exist",
    DEVELOPER_INFO:
      "User tried to delete driver that doesn't exist or is out of scope of his distributor (belongs to different distributor)",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50001: {
    MESSAGE: "Driver doesn't exist",
    DEVELOPER_INFO:
      "User tried to modify driver that doesn't exist or is out of scope of his distributor (belongs to different distributor)",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50002: {
    MESSAGE: "Too many requests",
    DEVELOPER_INFO: "User exceeded number of requests",
    CODE: CODES.REJECTED,
    STATUS: 409,
  },
  50003: {
    MESSAGE: "Request doesn't exist",
    DEVELOPER_INFO:
      "User tried to delete request that doesn't exist or is outside of his scope",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50004: {
    MESSAGE: "Vechicle with such registration number already exists",
    DEVELOPER_INFO: "User tried to add vechicle that already exists",
    CODE: CODES.REJECTED,
    STATUS: 422,
  },
  50005: {
    MESSAGE: "Vechicle doesn't exist",
    DEVELOPER_INFO:
      "User tried to delete vechicle that doesn't exist or is outside of his scope",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
};

//EXPORTS
module.exports = {
  CODES,
  DATABASE_ERRORS,
};
