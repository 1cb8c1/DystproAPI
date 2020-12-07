CREATE PROCEDURE modify_driver
    @driver_id INT,
    @name VARCHAR(32),
    @surname VARCHAR(32)
AS
BEGIN
    IF(@name != NULL)
    BEGIN
        UPDATE drivers SET name = @name WHERE driver_id = @driver_id
    END
    IF(@surname != NULL)
    BEGIN
        UPDATE drivers SET surname = @surname WHERE driver_id = @driver_id
    END
END