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
  50006: {
    MESSAGE: "Trying to reserve too small amount (0)",
    DEVELOPER_INFO: "User tried to reserve amount of product that is 0",
    CODE: CODES.REJECTED,
    STATUS: 422,
  },
  50007: {
    MESSAGE:
      "Trying to reserve amount that exceedes amount that is available in this warehouse",
    DEVELOPER_INFO:
      "User tried to reserve amount of producta that exceedes available amount in the warehouse",
    CODE: CODES.REJECTED,
    STATUS: 422,
  },
  50008: {
    MESSAGE: "Failed to create reservation",
    DEVELOPER_INFO:
      "Failed to create reservation, it shouldn't happen as checks has been made to ensure that it will be made. Failes when created reservation count is != 1",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50009: {
    MESSAGE: "Failed to update products_warehouses",
    DEVELOPER_INFO:
      "Failed to update one row in producs_warehouses, it shouldn't happen since there is xlock on that row",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50010: {
    MESSAGE: "Reservation doesn't exist",
    DEFELOPER_INFO:
      "User tried to delete reservation that doesn't exist, or there are two reservations with the same id (shouldn't happen)",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50011: {
    MESSAGE: "Product in such warehouse doesn't exist",
    DEVELOPER_INFO:
      "Reservation had product_warehouse_id that doesn't exist in table products_warehouses." +
      "This shouldn't happen when canceling, as all products_warehouses are archived." +
      "But this can happen when creating reservation and providing non-existant product_warehouse or that product_warehouse is archived",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50012: {
    MESSAGE: "Failed to delete one reservation",
    DEVELOPER_INFO:
      "Failed to delete reservation (shouldn't happen since there is xlock on the row reservations), or deleted more than one reservation (shouldn't happen)",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50013: {
    MESSAGE: "Failed to update product in a warehouse",
    DEVELOPER_INFO:
      "Failed to update product_warehouse (amount), This shouldn't happen since there is xlock on that product_warehouse",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50014: {
    MESSAGE: "Reservation doesn't exist",
    DEVELOPER_INFO:
      "User tried to create a dispatch with non-existant reservation",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50015: {
    MESSAGE: "Dispatch with such id doesn't exist",
    DEVELOPER_INFO:
      "When creating dispatched_product, wrong dispatch_id was provided. It shouldn't happen because dispatch_id is not provided by user",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50016: {
    MESSAGE: "Failed to insert dispatched product",
    DEVELOPER_INFO:
      "In procedure create_dispatched_product failed to insert dispatched_product",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50017: {
    MESSAGE: "Failed to delete reservation",
    DEVELOPER_INFO:
      "Failed to delete reservation after creating dispatched_product",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50018: {
    MESSAGE: "Failed to create dispatch",
    DEVELOPER_INFO: "Failed to create dispatch in create_dispatch procedure.",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50019: {
    MESSAGE: "Dispatch doesn't exist",
    DEVELOPER_INFO: "User tried to cancel dispatch that doesn't exist",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50020: {
    MESSAGE: "Dispatch hasn't been created",
    DEVELOPER_INFO: "Dispatch exists but doesn't have status CREATED",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50021: {
    MESSAGE: "Dispatch has been already canceled",
    DEVELOPER_INFO:
      "User tried to cancel dispatch that has been already canceled",
    CODE: CODES.REJECTED,
    STATUS: 422,
  },
  50022: {
    MESSAGE: "Failed to create status of a dispatch",
    DEVELOPER_INFO: "Failed to create dispatch_status in cancel_dispatch",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50023: {
    MESSAGE: "Warehouse with such name already exists",
    DEVELOPER_INFO:
      "User tried to create warehouse with not unique name. Procedure create_warehouse",
    CODE: CODES.REJECTED,
    STATUS: 422,
  },
  50024: {
    MESSAGE: "Failed to create warehouse",
    DEVELOPER_INFO: "Failed to create warehouse in procedure create_warehouse",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50025: {
    MESSAGE: "Warehouse doesn't exist or is already archived",
    DEVELOPER_INFO:
      "User tried to delete warehouse that doesn't exist or is already archived, procedure delete_warehouse",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50026: {
    MESSAGE: "Failed to delete warehouse",
    DEVELOPER_INFO: "Failed to delete warehouse, procedure delete_warehouse",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
  50027: {
    MESSAGE: "Warehouse doesn't exist or is not archived",
    DEVELOPER_INFO:
      "User tried to reopen warehouse that doesn't exist or is not archived, procedure reopen_warehouse",
    CODE: CODES.NOTFOUND,
    STATUS: 404,
  },
  50028: {
    MESSAGE: "Failed to reopen warehouse",
    DEVELOPER_INFO: "Failed to reopen warehouse, procedure reopen_warehouse",
    CODE: CODES.LOGIC,
    STATUS: 500,
  },
};

//EXPORTS
module.exports = {
  CODES,
  DATABASE_ERRORS,
};
