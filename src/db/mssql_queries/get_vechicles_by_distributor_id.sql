CREATE FUNCTION get_vechicles_by_distributor_id(@distributor_id INT)
RETURNS TABLE
AS
RETURN
SELECT vechicle_id, registration_number
FROM vechicles
WHERE distributor_id = @distributor_id AND archived = 0