CREATE FUNCTION get_product_availability(@id INT)
RETURNS TABLE 
AS
RETURN
SELECT product_warehouse_id, amount, warehouse_name
FROM products_warehouses
WHERE product_id = @id AND archived = 0
GO