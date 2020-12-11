CREATE FUNCTION get_vechicle_by_id(@vechicle_id INT, @distributor_ID INT)
RETURNS TABLE
AS
RETURN
SELECT vechicle_id, registration_number
FROM vechicles
WHERE vechicle_id = @vechicle_id AND distributor_id = @distributor_id AND archived = 0