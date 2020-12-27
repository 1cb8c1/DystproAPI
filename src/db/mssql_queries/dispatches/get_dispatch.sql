
CREATE FUNCTION get_dispatch(@distributor_id INT, @dispatch_id INT)
RETURNS TABLE AS
RETURN
SELECT dispatches.dispatch_id, dispatches.pickup_planned_date,
    drivers.driver_id, drivers.name, drivers.surname,
    vehicles.vehicle_id, vehicles.registration_number
FROM dispatches
    INNER JOIN vehicles ON vehicles.vehicle_id = dispatches.vehicle_id AND dispatch_id = @dispatch_id AND dispatches.distributor_id = @distributor_id
    INNER JOIN drivers ON drivers.driver_id = dispatches.driver_id 