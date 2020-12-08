CREATE PROCEDURE remove_driver_by_id
    @driver_id INT,
    @distributor_id INT
AS
BEGIN
    DECLARE @driversCount INT
    SELECT @driversCount = COUNT(driver_id)
    FROM drivers
    WHERE driver_id = @driver_id AND distributor_id = @distributor_id

    IF(@driversCount < 1)
        THROW 50000, 'Trying to delete driver that doesnt exist for this distributor', 1

    DELETE drivers WHERE driver_id = @driver_id
END