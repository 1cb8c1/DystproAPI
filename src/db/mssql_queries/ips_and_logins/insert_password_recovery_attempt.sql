CREATE PROCEDURE insert_password_recovery_attempt
    @ip VARCHAR(45),
    @email VARCHAR(64)
AS
BEGIN
    INSERT INTO password_recovery_attempts
        (ip, email, date)
    VALUES(@ip, @email, GETDATE())
END