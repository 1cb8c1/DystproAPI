CREATE PROCEDURE create_dispatch
    @distributor_id INT,
    @driver_id INT,
    @vehicle_id INT,
    @pickup_planned_date AS DATETIME = NULL,
    @dispatch_id INT OUT
AS
SET XACT_ABORT ON
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION

    /*CHECK IF vehicle EXISTS*/
    IF((SELECT COUNT(vehicle_id)
    FROM vehicles
    WHERE vehicles.vehicle_id = @vehicle_id AND vehicles.archived = 0 AND vehicles.distributor_id = @distributor_id) != 1)
        THROW 50005, 'Vehicle doesnt exist', 1

    /*CHECK IF drivers EXISTS*/
    IF((SELECT COUNT(driver_id)
    FROM drivers
    WHERE drivers.driver_id = @driver_id AND drivers.archived = 0 AND drivers.distributor_id = @distributor_id) != 1)
        THROW 50001, 'Driver doesnt exist', 1

    /*CREATE dispatch*/
    DECLARE @my_table table(dispatch_id INT)
    INSERT dispatches
        (distributor_id, driver_id, vehicle_id, pickup_planned_date)
    OUTPUT INSERTED.dispatch_id
            INTO @my_table
    VALUES(@distributor_id, @driver_id, @vehicle_id, ISNULL(@pickup_planned_date, DATEADD(DAY, 7, GETDATE())))

    /*CHECK IF dispatch WAS CREATED*/
    IF((SELECT COUNT(dispatch_id)
    FROM @my_table) != 1)
        THROW 50018, 'Failed to create dispatch', 1

    /*RETURN dispatch_id*/
    SELECT @dispatch_id = dispatch_id
    FROM @my_table

    COMMIT TRANSACTION
END