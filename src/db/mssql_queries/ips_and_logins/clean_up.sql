CREATE PROCEDURE clean_up
AS
BEGIN
    DELETE password_recovery_attempts WHERE DATEDIFF(HOUR, date, GETDATE()) >= 24
    DELETE failed_logins WHERE DATEDIFF(HOUR, date, GETDATE()) >= 24
END

