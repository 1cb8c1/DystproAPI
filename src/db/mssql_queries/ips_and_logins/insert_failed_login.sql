CREATE PROCEDURE insert_failed_login
    @ip VARCHAR(45)
AS
BEGIN
    INSERT INTO failed_logins
        (ip, date)
    VALUES(@ip, GETDATE())
END