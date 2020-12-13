CREATE PROCEDURE remove_vehicle_by_id
    @vehicle_id INT,
    @distributor_id INT
AS
BEGIN
    DECLARE @vehiclesCount INT
    SELECT @vehiclesCount = COUNT(vehicle_id)
    FROM vehicles
    WHERE vehicle_id = @vehicle_id AND distributor_id = @distributor_id AND archived = 0

    IF(@vehiclesCount < 1)
        THROW 50005, 'Trying to delete vehicle that doesnt exist for this distributor', 1

    DELETE vehicles WHERE vehicle_id = @vehicle_id
END