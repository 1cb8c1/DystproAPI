CREATE PROCEDURE create_driver
    @name VARCHAR(32),
    @surname VARCHAR(32),
    @distributor_id INT,
    @driver_id INT OUTPUT
AS
BEGIN
    DECLARE @my_table table(driver_id INT)

    INSERT drivers
        (name, surname, distributor_id)
    OUTPUT INSERTED.driver_id
            INTO @my_table
    VALUES(@name, @surname , @distributor_id)

    SELECT @driver_id = driver_id
    FROM @my_table
END