CREATE PROCEDURE modify_driver
    @driver_id INT,
    @name VARCHAR(32),
    @surname VARCHAR(32),
    @distributor_id INT
AS
BEGIN
    DECLARE @driversCount INT
    SELECT @driversCount = COUNT(driver_id)
    FROM drivers
    WHERE driver_id = @driver_id AND distributor_id = @distributor_id AND archived = 0

    IF(@driversCount < 1)
        THROW 50001, 'Trying to modify driver that doesnt exist for this distributor', 1

    IF(@name IS NOT NULL)
    BEGIN
        UPDATE drivers SET name = @name WHERE driver_id = @driver_id
    END
    IF(@surname IS NOT NULL)
    BEGIN
        UPDATE drivers SET surname = @surname WHERE driver_id = @driver_id
    END
END