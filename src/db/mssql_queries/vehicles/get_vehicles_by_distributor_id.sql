CREATE FUNCTION get_vehicles_by_distributor_id(@distributor_id INT)
RETURNS TABLE
AS
RETURN
SELECT vehicle_id, registration_number
FROM vehicles
WHERE distributor_id = @distributor_id AND archived = 0