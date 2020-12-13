CREATE PROCEDURE create_vehicle
    @registration_number VARCHAR(16),
    @distributor_id INT,
    @vehicle_id INT OUT
AS
BEGIN
    DECLARE @vehiclesCount INT
    SELECT @vehiclesCount=COUNT(registration_number)
    FROM vehicles
    WHERE registration_number = @registration_number AND archived = 0

    IF(@vehiclesCount > 0)
        THROW 50004, 'Vehicle already exists', 1



    DECLARE @my_table table(vehicle_id INT)

    INSERT vehicles
        (registration_number, distributor_id)
    OUTPUT INSERTED.vehicle_id
            INTO @my_table
    VALUES(@registration_number, @distributor_id)

    SELECT @vehicle_id = vehicle_id
    FROM @my_table
END