CREATE FUNCTION get_warehouse_by_name(@name NVARCHAR(32))
RETURNS TABLE
AS
RETURN
SELECT *
FROM warehouses
WHERE warehouse = @name