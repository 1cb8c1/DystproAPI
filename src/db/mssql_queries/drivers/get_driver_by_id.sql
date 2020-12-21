CREATE FUNCTION get_driver_by_id(@driver_id INT, @distributor_ID INT)
RETURNS TABLE
AS
RETURN
SELECT driver_id, name, surname
FROM drivers
WHERE driver_id = @driver_id AND distributor_id = @distributor_id AND archived = 0