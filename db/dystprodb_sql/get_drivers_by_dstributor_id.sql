CREATE FUNCTION get_drivers_by_distributor_id(@distributor_id INT)
RETURNS TABLE
AS
RETURN
SELECT driver_id, name, surname
FROM drivers
WHERE distributor_id = @distributor_id AND archived = 0