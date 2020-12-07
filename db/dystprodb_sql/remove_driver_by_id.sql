CREATE PROCEDURE remove_driver_by_id
    @driver_id INT
AS
BEGIN
    DELETE drivers WHERE driver_id = @driver_id
END