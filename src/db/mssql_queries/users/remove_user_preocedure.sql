CREATE PROCEDURE remove_user_procedure
    @id INT
AS
BEGIN
    DELETE users WHERE user_id = @id
END