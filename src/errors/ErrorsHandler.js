const sql = require("mssql");
const { CODES, DATABASE_ERRORS } = require("./Errors");

const errorHandler = (err, req, res, next) => {
  if (
    err instanceof sql.RequestError &&
    err.code === "EREQUEST" &&
    Object.prototype.hasOwnProperty.call(DATABASE_ERRORS, err.number)
  ) {
    return res.status(DATABASE_ERRORS[err.number].STATUS).send({
      error: {
        code: DATABASE_ERRORS[err.number].CODE,
        message: DATABASE_ERRORS[err.number].MESSAGE,
      },
      ...err.onResponseData,
    });
  } else if (
    (err instanceof sql.RequestError ||
      err instanceof sql.PreparedStatementError) &&
    (err.code === "EARGS" || err.code === "EINJECT")
  ) {
    return res
      .status(422)
      .send(
        { error: CODES.BADARGUMENT, message: "Invalid argument" },
        ...err.onResponseData
      );
  } else if (
    [
      sql.ConnectionError,
      sql.TransactionError,
      sql.RequestError,
      sql.PreparedStatementError,
    ].some((errorType) => {
      return err instanceof errorType;
    })
  ) {
    return res.status(500).send({
      error: { code: CODES.DATABASE, message: "Database returned error" },
      ...err.onResponseData,
    });
  } else {
    return res.status(500).send({
      error: { code: CODES.LOGIC, message: "Unknown error" },
      ...err.onResponseData,
    });
  }
};

module.exports = errorHandler;
