CREATE PROCEDURE change_user_distributor
    @user_id INT,
    @distributor_id INT
AS
SET XACT_ABORT ON
BEGIN
    BEGIN TRANSACTION
    UPDATE users SET distributor = @distributor_id WHERE user_id = @user_id
    COMMIT TRANSACTION
END