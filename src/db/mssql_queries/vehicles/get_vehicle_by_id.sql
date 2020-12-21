CREATE FUNCTION get_vehicle_by_id(@vehicle_id INT, @distributor_ID INT)
RETURNS TABLE
AS
RETURN
SELECT vehicle_id, registration_number
FROM vehicles
WHERE vehicle_id = @vehicle_id AND distributor_id = @distributor_id AND archived = 0